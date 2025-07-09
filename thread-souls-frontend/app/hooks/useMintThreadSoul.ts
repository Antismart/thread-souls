import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import CoinV4Abi from "../abi/CoinV4.json";

// Custom hook for minting ThreadSouls using Zora CoinV4
export function useMintThreadSoul() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Use wagmi's useWriteContract for mint (wagmi v1+)
  const { writeContractAsync } = useWriteContract();

  // Base Sepolia chainId: 84532
  const BASE_SEPOLIA_CHAIN_ID = 84532;

  const mint = async (coinAddress: string, quantity: number, valueEth?: string, chainId: number = BASE_SEPOLIA_CHAIN_ID) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!address) throw new Error("Wallet not connected");
      const tx = await writeContractAsync({
        address: coinAddress as `0x${string}`,
        abi: CoinV4Abi as any,
        functionName: "mint",
        args: [address, quantity],
        value: valueEth ? parseEther(valueEth) : 0n,
        chainId,
      });
      // wagmi may return a string or an object with a hash property
      // Try to extract hash if tx is an object, fallback to string
      let txHash: string | undefined = undefined;
      if (typeof tx === "string") {
        txHash = tx;
      } else if (tx && typeof tx === "object" && "hash" in tx) {
        txHash = (tx as any).hash;
      }
      setSuccess(txHash || "Minted successfully!");
      return txHash;
    } catch (err: any) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mint, loading, error, success };
}
