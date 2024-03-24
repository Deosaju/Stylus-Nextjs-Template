#![cfg_attr(not(feature = "export-abi"), no_main)]

use alloy_primitives::Address;
use alloy_primitives::U256;
use stylus_sdk::msg;
use stylus_sdk::stylus_proc::entrypoint;
use stylus_sdk::prelude::external;
use stylus_sdk::prelude::sol_storage;
use stylus_sdk::call;

extern crate alloc;

#[global_allocator]
static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;

sol_storage! {
    #[entrypoint]
    pub struct Escrow {
        mapping(Address => uint256) balances;
        address owner;
        address buyer;
        address seller;
        uint256 escrow_amount;
    }
}

#[external]
impl Escrow {
    /// Gets the owner from storage.
    pub fn owner(&self) -> Result<Address, Vec<u8>> {
        Ok(self.owner.get())
    }

    pub fn initialize(&mut self, buyer: Address, seller: Address, escrow_amount: U256) {
        let owner = msg::sender();
        self.owner.set(owner);
        self.buyer.set(buyer);
        self.seller.set(seller);
        self.escrow_amount.set(escrow_amount);
    }

    pub fn set_owner(&mut self, new_owner: Address) -> Result<(), Vec<u8>> {
        match self.owner() {
            Ok(owner) if msg::sender() == owner => {
                self.owner.set(new_owner);
                Ok(())
            }
            _ => Err(b"Only the owner can set a new owner".to_vec()),
        }
    }

    pub fn deposit(&mut self) {
        let sender = msg::sender();
        let value = msg::value();
        match (self.buyer(), self.escrow_amount()) {
            (Ok(buyer), Ok(escrow_amount)) if sender == buyer && value == escrow_amount => {
                let current_balance = self.balances.get(sender);
                self.balances.insert(sender, current_balance + value);
            }
            _ => panic!("Invalid deposit conditions"),
        }
    }
    
    pub fn release(&mut self) {
        match (self.owner(), self.buyer(), self.seller(), self.escrow_amount()) {
            (Ok(owner), Ok(buyer), Ok(seller), Ok(escrow_amount)) if msg::sender() == owner => {
                let buyer_balance = self.balances.get(buyer);
                if buyer_balance == escrow_amount {
                    call::transfer_eth(seller, escrow_amount).expect("Failed to transfer funds to the seller");
                } else {
                    panic!("Buyer's deposited amount must match the escrow amount");
                }
            }
            _ => panic!("Only the owner can release funds"),
        }
    }
    
    pub fn refund(&mut self) {
        match (self.owner(), self.buyer()) {
            (Ok(owner), Ok(buyer)) if msg::sender() == owner => {
                let buyer_balance = self.balances.get(buyer);
                if buyer_balance > U256::default() {
                    call::transfer_eth(buyer, buyer_balance).expect("Failed to refund funds to the buyer");
                } else {
                    panic!("No funds to refund");
                }
            }
            _ => panic!("Only the owner can refund funds"),
        }
    }

    pub fn buyer(&self) -> Result<Address, Vec<u8>> {
        Ok(self.buyer.get())
    }

    pub fn seller(&self) -> Result<Address, Vec<u8>> {
        Ok(self.seller.get())
    }

    pub fn escrow_amount(&self) -> Result<U256, Vec<u8>> {
        Ok(self.escrow_amount.get())
    }
}