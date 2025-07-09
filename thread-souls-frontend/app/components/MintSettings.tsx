"use client";
import { useState } from "react";
import type { ThreadSoul } from "./ThreadSoulsFlow";
import { Button } from "./Button";
import { MintCollectButton } from "./MintCollectButton";

// Placeholder for now, will add IPFS + Zora integration next

type MintSettingsProps = {
  threadSoul: ThreadSoul;
  onBack: () => void;
  onSuccess: (updated: ThreadSoul) => void;
};

export default function MintSettings({ threadSoul, onBack, onSuccess }: MintSettingsProps) {

  const [supply, setSupply] = useState(threadSoul.supply || 100);
  const [price, setPrice] = useState(threadSoul.price || "");
  const [minted, setMinted] = useState(false);

  // Called after successful mint (from MintCollectButton)
  function handleMintSuccess() {
    setMinted(true);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold mb-2">Mint Your ThreadSoul</h2>
      <div className="space-y-2">
        <label className="block font-medium">Token Supply</label>
        <input
          type="number"
          min={1}
          max={10000}
          className="w-full px-3 py-2 rounded border"
          value={supply}
          onChange={(e) => setSupply(Number(e.target.value))}
          required
          disabled={minted}
        />
        <label className="block font-medium mt-2">Price (ETH, optional)</label>
        <input
          type="number"
          min={0}
          step={0.0001}
          className="w-full px-3 py-2 rounded border"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0 (free)"
          disabled={minted}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} type="button" disabled={minted}>Back</Button>
      </div>
      {/* MintCollectButton handles minting and post-mint UI */}
      <MintCollectButton
        coinAddress={threadSoul.coinAddress || ""}
        price={price}
        quantity={supply}
        // After successful mint, show post-mint UI and optionally call onSuccess
      />
    </div>
  );
}
