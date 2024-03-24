import { useWriteContract } from 'wagmi'
import { abi } from '../abis/abi'

export default function SetNumber() {
    const { writeContract } = useWriteContract()
    return (
        <button
            onClick={() =>
                writeContract({
                    abi,
                    address: process.env.CONTRACT_DEPLOYMENT_ADDRESS,
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