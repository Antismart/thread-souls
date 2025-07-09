"use client";

import { useState } from "react";
import ThreadBuilder from "./ThreadBuilder";
import ThreadPreview from "./ThreadPreview";
import MintSettings from "./MintSettings";
import MintSuccess from "./MintSuccess";

export type ThreadMoment = {
  id: string;
  type: "tweet" | "image" | "spotify" | "youtube" | "text";
  title: string;
  url?: string;
  caption?: string;
  imageFile?: File;
};

export type ThreadSoul = {
  title: string;
  description: string;
  moments: ThreadMoment[];
  supply: number;
  price?: string;
  image?: string;
  metadataUrl?: string;
  coinAddress?: string;
};

export default function ThreadSoulsFlow() {
  const [step, setStep] = useState<"builder" | "preview" | "mint" | "success">("builder");
  const [threadSoul, setThreadSoul] = useState<ThreadSoul | null>(null);

  return (
    <div className="w-full max-w-lg mx-auto py-6">
      {step === "builder" && (
        <ThreadBuilder
          onNext={(data) => {
            setThreadSoul(data);
            setStep("preview");
          }}
          initial={threadSoul}
        />
      )}
      {step === "preview" && threadSoul && (
        <ThreadPreview
          threadSoul={threadSoul}
          onBack={() => setStep("builder")}
          onNext={() => setStep("mint")}
        />
      )}
      {step === "mint" && threadSoul && (
        <MintSettings
          threadSoul={threadSoul}
          onBack={() => setStep("preview")}
          onSuccess={(updated) => {
            setThreadSoul(updated);
            setStep("success");
          }}
        />
      )}
      {step === "success" && threadSoul && (
        <MintSuccess threadSoul={threadSoul} />
      )}
    </div>
  );
}
