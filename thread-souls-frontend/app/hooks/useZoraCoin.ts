import { useState } from "react";
import { setApiKey, createCoin } from "@zoralabs/coins-sdk";
import { uploadFileToPinata, uploadJSONToPinata } from "../utils/pinata";
import { ThreadSoul, ThreadMoment } from "../components/ThreadSoulsFlow";
import { useWalletClient } from "wagmi";
import { parseEther } from "viem";

export default function useZoraCoin() {
  const [coinData, setCoinData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set up Zora API key (client-side, for demo; for production, use server-side)
  if (typeof window !== "undefined") {
    setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY || "");
  }

  // Get viem wallet client from wagmi
  const { data: walletClient } = useWalletClient();

  // Helper: upload all images in moments to Pinata, return updated moments with image URLs
  const uploadMomentImages = async (moments: ThreadMoment[]) => {
    const updated = await Promise.all(
      moments.map(async (m) => {
        if (m.type === "image" && m.imageFile) {
          const res: { IpfsHash: string } = await uploadFileToPinata(m.imageFile);
          return { ...m, url: `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}` };
        }
        return m;
      })
    );
    return updated;
  };

  // Helper: generate metadata JSON for ThreadSoul
  const generateMetadata = (threadSoul: ThreadSoul, imageUrl?: string) => {
    return {
      name: threadSoul.title,
      description: threadSoul.description,
      image: imageUrl || threadSoul.image || "",
      moments: threadSoul.moments.map((m) => ({
        type: m.type,
        title: m.title,
        url: m.url,
        caption: m.caption,
      })),
      supply: threadSoul.supply,
      price: threadSoul.price,
      createdAt: new Date().toISOString(),
    };
  };

  // Main: create and mint a ThreadSoul Coin
  const createThreadSoulCoin = async (threadSoul: ThreadSoul) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Upload all images in moments to Pinata
      const updatedMoments = await uploadMomentImages(threadSoul.moments);

      // 2. Optionally, use the first image as the thread image
      let threadImageUrl = "";
      const firstImage = updatedMoments.find((m) => m.type === "image" && m.url);
      if (firstImage) threadImageUrl = firstImage.url!;

      // 3. Generate metadata JSON
      const metadata = generateMetadata({ ...threadSoul, moments: updatedMoments }, threadImageUrl);

      // 4. Upload metadata to Pinata
      const metaRes = await uploadJSONToPinata(metadata);
      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metaRes.IpfsHash}`;

      // 5. Call Zora CoinV4 SDK to mint (with viem signer)
      const address = walletClient?.account?.address;
      const coinDetails = {
        name: threadSoul.title,
        symbol: threadSoul.title.slice(0, 8).replace(/[^A-Z]/g, '').toUpperCase() || 'SOUL',
        totalSupply: BigInt(threadSoul.supply),
        metadataURI: metadataUrl,
        owner: address,
        initialSupplyRecipient: address,
        ...(threadSoul.price ? { mintPricePerToken: parseEther(threadSoul.price) } : {}),
      };
      if (!walletClient) throw new Error("Wallet client not found. Connect your wallet.");
      // createCoin expects: (coinDetails, walletClient, viemClient, ...)
      // For wagmi/viem, walletClient acts as both signer and client
      const response = await createCoin(coinDetails as any, walletClient as any, walletClient as any);

      setCoinData(response as any);
      return {
        ...threadSoul,
        moments: updatedMoments,
        image: threadImageUrl,
        metadataUrl,
        coinAddress: (response as any)?.address,
      };
    } catch (err: any) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { coinData, loading, error, createThreadSoulCoin };
}