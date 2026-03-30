"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { getPocketBase } from "@/lib/pocketbase";

interface Reaction {
  id: string;
  type: "like" | "love" | "helpful";
  user: string;
}

interface ReactionCount {
  type: "like" | "love" | "helpful";
  count: number;
  userReacted: boolean;
}

interface ReactionsProps {
  targetType: "announcement" | "material";
  targetId: string;
}

const reactionEmojis = {
  like: "👍",
  love: "❤️",
  helpful: "💡",
};

export function Reactions({ targetType, targetId }: ReactionsProps) {
  const { user } = useAuth();
  const { dict } = useLocale();
  const t = dict.common.reactions;
  
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [loading, setLoading] = useState(true);

  const pb = getPocketBase();

  const loadReactions = async () => {
    try {
      setLoading(true);
      const records = await pb.collection("reactions").getFullList<Reaction>({
        filter: `target_type = "${targetType}" && target_id = "${targetId}"`,
      });

      // Count reactions by type
      const counts: Record<string, { count: number; userReacted: boolean }> = {
        like: { count: 0, userReacted: false },
        love: { count: 0, userReacted: false },
        helpful: { count: 0, userReacted: false },
      };

      records.forEach((reaction) => {
        counts[reaction.type].count++;
        if (reaction.user === user?.id) {
          counts[reaction.type].userReacted = true;
        }
      });

      setReactions([
        { type: "like", ...counts.like },
        { type: "love", ...counts.love },
        { type: "helpful", ...counts.helpful },
      ]);
    } catch (error) {
      console.error("Failed to load reactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReactions();
  }, [targetType, targetId]);

  const handleReaction = async (type: "like" | "love" | "helpful") => {
    if (!user) return;

    try {
      const existing = await pb.collection("reactions").getFullList<Reaction>({
        filter: `target_type = "${targetType}" && target_id = "${targetId}" && user = "${user.id}" && type = "${type}"`,
      });

      if (existing.length > 0) {
        // Remove reaction
        await pb.collection("reactions").delete(existing[0].id);
      } else {
        // Add reaction (remove other reactions first to allow only one per user)
        const allUserReactions = await pb.collection("reactions").getFullList<Reaction>({
          filter: `target_type = "${targetType}" && target_id = "${targetId}" && user = "${user.id}"`,
        });
        
        for (const reaction of allUserReactions) {
          await pb.collection("reactions").delete(reaction.id);
        }

        await pb.collection("reactions").create({
          type,
          user: user.id,
          target_type: targetType,
          target_id: targetId,
        });
      }

      await loadReactions();
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 items-center">
        <div className="text-sm text-[var(--color-ink-secondary)]">
          {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {reactions.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => handleReaction(reaction.type)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            border transition-all
            ${
              reaction.userReacted
                ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                : "bg-[var(--color-surface-card)] border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-tint)]"
            }
          `}
          disabled={!user}
          title={t[reaction.type]}
        >
          <span className="text-base">{reactionEmojis[reaction.type]}</span>
          {reaction.count > 0 && <span>{reaction.count}</span>}
        </button>
      ))}
    </div>
  );
}
