"use client";
import type { ThreadSoul } from "./ThreadSoulsFlow";
import { Button } from "./Button";

type ThreadPreviewProps = {
  threadSoul: ThreadSoul;
  onBack: () => void;
  onNext: () => void;
};

export default function ThreadPreview({ threadSoul, onBack, onNext }: ThreadPreviewProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold mb-2">Preview Your ThreadSoul</h2>
      <div className="bg-white/10 p-4 rounded border">
        <h3 className="font-semibold text-lg mb-1">{threadSoul.title}</h3>
        <p className="mb-2 text-sm text-gray-500">{threadSoul.description}</p>
        <ol className="space-y-3">
          {threadSoul.moments.map((m, i) => (
            <li key={m.id} className="border-b pb-2">
              <div className="font-semibold">{i + 1}. {m.title}</div>
              <div className="text-xs text-gray-400">{m.type}</div>
              {m.url && <div className="text-xs break-all">{m.url}</div>}
              {m.caption && <div className="italic text-xs">{m.caption}</div>}
              {m.type === "image" && m.imageFile && (
                <img
                  src={URL.createObjectURL(m.imageFile)}
                  alt={m.title}
                  className="max-h-32 mt-2 rounded"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="primary" onClick={onNext}>Next: Mint</Button>
      </div>
    </div>
  );
}
