import { useMintThreadSoul } from "../hooks/useMintThreadSoul";
import { Button } from "./Button";
import { useAccount } from "wagmi";
import { useChainId, useSwitchChain } from "wagmi";


interface MintCollectButtonProps {
  coinAddress: string;
  price?: string;
  quantity?: number;
}


export function MintCollectButton({ coinAddress, price, quantity = 1 }: MintCollectButtonProps) {
  const { mint, loading, error, success } = useMintThreadSoul();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  // Base Sepolia chainId
  const BASE_SEPOLIA_CHAIN_ID = 84532;

  const handleMint = async () => {
    if (!address) {
      alert("Please connect your wallet to mint.");
      return;
    }
    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      alert("Please switch to Base Sepolia to mint.");
      return;
    }
    try {
      await mint(coinAddress, quantity, price);
    } catch (err) {
      // error state handled in hook
    }
  };

  // Helper: get Zora and BaseScan URLs
  const getZoraUrl = () => coinAddress ? `https://zora.co/collect/base:${coinAddress}` : "#";
  const getBaseScanUrl = (txHash: string) => txHash ? `https://sepolia.basescan.org/tx/${txHash}` : "#";

  // Helper: share on Farcaster (simple intent link)
  const shareOnFarcaster = () => {
    const url = getZoraUrl();
    const text = encodeURIComponent("🎉 I just minted a ThreadSoul on Zora! Check it out: " + url);
    window.open(`https://warpcast.com/~/compose?text=${text}`, "_blank");
  };

  // Helper: share on Twitter
  const shareOnTwitter = () => {
    const url = getZoraUrl();
    const text = encodeURIComponent("🎉 I just minted a ThreadSoul on Zora! Check it out: " + url);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  // Extract tx hash if available (success may be a hash or string)
  const txHash = success && success.startsWith("0x") ? success : undefined;

  const isWrongNetwork = chainId !== BASE_SEPOLIA_CHAIN_ID;

  return (
    <div className="my-4">
      {isWrongNetwork ? (
        <Button
          onClick={() => switchChain({ chainId: BASE_SEPOLIA_CHAIN_ID })}
          disabled={isSwitching}
          variant="primary"
        >
          {isSwitching ? "Switching..." : "Switch to Base Sepolia"}
        </Button>
      ) : (
        <Button onClick={handleMint} disabled={loading || !address} variant="primary">
          {loading ? "Minting..." : !address ? "Connect Wallet" : "Mint / Collect"}
        </Button>
      )}
      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
      {success && (
        <div className="text-green-600 text-xs mt-2 flex flex-col gap-2 animate-fade-in">
          <div>🎉 ThreadSoul Minted!</div>
          <div className="flex flex-wrap gap-2 mt-2">
            <a
              href={getZoraUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 hover:text-blue-800"
            >
              View on Zora
            </a>
            {txHash && (
              <a
                href={getBaseScanUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800"
              >
                View on BaseScan
              </a>
            )}
            <button
              onClick={shareOnFarcaster}
              className="underline text-blue-600 hover:text-blue-800"
              type="button"
            >
              Share on Farcaster
            </button>
            <button
              onClick={shareOnTwitter}
              className="underline text-blue-600 hover:text-blue-800"
              type="button"
            >
              Share on Twitter
            </button>
            <button
              onClick={() => window.location.reload()}
              className="underline text-blue-600 hover:text-blue-800"
              type="button"
            >
              Mint Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
