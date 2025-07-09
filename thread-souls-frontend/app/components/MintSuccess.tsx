"use client";
import type { ThreadSoul } from "./ThreadSoulsFlow";
import { Button } from "./Button";

// Placeholder for now, will add Zora/Farcaster links next

type MintSuccessProps = {
  threadSoul: ThreadSoul;
};

export default function MintSuccess({ threadSoul }: MintSuccessProps) {
  return (
    <div className="space-y-6 animate-fade-in text-center">
      <h2 className="text-2xl font-bold mb-2">🎉 ThreadSoul Minted!</h2>
      <p className="mb-2">Your ThreadSoul has been minted as a CoinV4 token.</p>
      <div className="bg-white/10 p-4 rounded border inline-block">
        <div className="font-semibold text-lg mb-1">{threadSoul.title}</div>
        <div className="text-xs text-gray-400 mb-2">{threadSoul.description}</div>
        <ol className="space-y-2 text-left">
          {threadSoul.moments.map((m, i) => (
            <li key={m.id}>
              <span className="font-semibold">{i + 1}. {m.title}</span>
              {m.caption && <span className="ml-2 italic text-xs">{m.caption}</span>}
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-4 space-x-2">
        {threadSoul.coinAddress && (
          <Button
            variant="primary"
            onClick={() => window.open(`https://zora.co/collect/${threadSoul.coinAddress}`, "_blank")}
          >
            View on Zora
          </Button>
        )}
        {/* TODO: Add Farcaster cast link/preview */}
      </div>
    </div>
  );
}
