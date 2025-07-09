"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ThreadMoment, ThreadSoul } from "./ThreadSoulsFlow";
import { Button } from "./Button";

const MOMENT_TYPES = [
  { value: "tweet", label: "Tweet" },
  { value: "image", label: "Image" },
  { value: "spotify", label: "Spotify" },
  { value: "youtube", label: "YouTube" },
  { value: "text", label: "Text" },
];

type ThreadBuilderProps = {
  onNext: (data: ThreadSoul) => void;
  initial?: ThreadSoul | null;
};

export default function ThreadBuilder({ onNext, initial }: ThreadBuilderProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [moments, setMoments] = useState<ThreadMoment[]>(
    initial?.moments || [getEmptyMoment(), getEmptyMoment(), getEmptyMoment()]
  );
  const [error, setError] = useState<string | null>(null);

  function getEmptyMoment(): ThreadMoment {
    return {
      id: uuidv4(),
      type: "text",
      title: "",
      caption: "",
    };
  }

  function handleAddMoment() {
    if (moments.length < 7) {
      setMoments([...moments, getEmptyMoment()]);
    }
  }

  function handleRemoveMoment(idx: number) {
    if (moments.length > 3) {
      setMoments(moments.filter((_, i) => i !== idx));
    }
  }

  function handleMomentChange(idx: number, field: keyof ThreadMoment, value: any) {
    setMoments((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (moments.length < 3 || moments.length > 7) {
      setError("You must have 3–7 moments.");
      return;
    }
    if (!title.trim()) {
      setError("Thread title is required.");
      return;
    }
    onNext({
      title,
      description,
      moments,
      supply: 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="mb-4 bg-white/80 dark:bg-[#181f2e] rounded-xl shadow-lg p-6 border border-[var(--app-accent-light)] dark:border-[var(--app-accent-active)]">
        <h2 className="text-2xl font-extrabold mb-4 text-white tracking-tight font-geist">Create Your ThreadSoul</h2>
        <input
          className="w-full px-4 py-3 rounded-lg border-2 border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)] mb-3 bg-[var(--app-accent-light)] text-white dark:bg-[var(--app-accent-active)] dark:text-white placeholder:text-white dark:placeholder:text-white font-geist text-lg"
          placeholder="Thread Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full px-4 py-3 rounded-lg border-2 border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)] bg-[var(--app-accent-light)] text-white dark:bg-[var(--app-accent-active)] dark:text-white placeholder:text-white dark:placeholder:text-white font-geist text-base"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <h3 className="font-semibold mb-4 text-white text-lg tracking-tight font-geist">Moments <span className="text-xs text-[var(--app-foreground-muted)]">({moments.length}/7)</span></h3>
        <div className="space-y-6">
          {moments.map((moment, idx) => (
            <div key={moment.id} className="p-4 border-2 border-[var(--app-accent)] rounded-xl bg-[var(--app-accent-light)] dark:bg-[var(--app-accent-active)] shadow-md flex flex-col gap-2 font-geist">
              <div className="flex gap-2 mb-2 items-center">
                <select
                  className="border-2 border-[var(--app-accent)] rounded-lg px-3 py-2 bg-[var(--app-accent-light)] text-white dark:bg-[var(--app-accent-active)] dark:text-white font-geist text-base focus:ring-2 focus:ring-[var(--app-accent)]"
                  value={moment.type}
                  onChange={(e) => handleMomentChange(idx, "type", e.target.value)}
                >
                  {MOMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <input
                  className="flex-1 border-2 border-[var(--app-accent)] rounded-lg px-3 py-2 font-geist text-base bg-white dark:bg-[#222] text-white dark:text-white placeholder:text-white dark:placeholder:text-white focus:ring-2 focus:ring-[var(--app-accent)]"
                  placeholder="Title"
                  value={moment.title}
                  onChange={(e) => handleMomentChange(idx, "title", e.target.value)}
                  required
                />
                {moments.length > 3 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveMoment(idx)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                  >
                    Remove
                  </Button>
                )}
              </div>
              {moment.type === "image" ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMomentChange(idx, "imageFile", e.target.files?.[0])}
                />
              ) : (
                <input
                  className="w-full border-2 border-[var(--app-accent)] rounded-lg px-3 py-2 font-geist text-base bg-white dark:bg-[#222] text-white dark:text-white placeholder:text-white dark:placeholder:text-white focus:ring-2 focus:ring-[var(--app-accent)] mb-1"
                  placeholder={
                    moment.type === "tweet"
                      ? "Tweet URL"
                      : moment.type === "spotify"
                      ? "Spotify Link"
                      : moment.type === "youtube"
                      ? "YouTube Link"
                      : ""
                  }
                  value={moment.url || ""}
                  onChange={(e) => handleMomentChange(idx, "url", e.target.value)}
                  style={{ display: moment.type === "text" ? "none" : undefined }}
                />
              )}
              <textarea
                className="w-full border-2 border-[var(--app-accent)] rounded-lg px-3 py-2 font-geist text-base bg-white dark:bg-[#222] text-white dark:text-white placeholder:text-white dark:placeholder:text-white focus:ring-2 focus:ring-[var(--app-accent)]"
                placeholder="Caption (optional)"
                value={moment.caption || ""}
                onChange={(e) => handleMomentChange(idx, "caption", e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddMoment}
            disabled={moments.length >= 7}
          >
            Add Moment
          </Button>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" variant="primary">
        Next: Preview
      </Button>
    </form>
  );
}
