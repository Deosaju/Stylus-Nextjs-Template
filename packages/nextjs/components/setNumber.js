import { useWriteContract } from 'wagmi'
import { abi } from '../abis/abi'

export default function SetNumber() {
    const { writeContract } = useWriteContract()
    return (
        <button
            onClick={() =>
                writeContract({
                    abi,
                    address: '0xBe702231908AB2dbFc156e18Bab6c57285883694',
                    functionName: 'setNumber',
                    args: [
                        '1',
                    ],
                })
            }
        >
            Set Number as 1
        </button>
    )
}