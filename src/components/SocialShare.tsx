import { motion } from "motion/react";
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { analytics } from "../utils/analytics";

interface SocialShareProps {
  url?: string;
  title: string;
  description?: string;
  hashtags?: string[];
  contentType?: "blog" | "project" | "case-study" | "page";
}

export function SocialShare({
  url,
  title,
  description,
  hashtags = [],
  contentType = "page",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const handleCopyLink = async () => {
    try {
      const { copyToClipboard } = await import("../utils/clipboardHelper");
      const success = await copyToClipboard(shareUrl, "Lien copié !");
      if (success) {
        setCopied(true);
        analytics.trackSocialShare("Copy Link", contentType, title);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: string) => {
    analytics.trackSocialShare(platform, contentType, title);
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${hashtags.length > 0 ? `&hashtags=${hashtags.join(",")}` : ""}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2 text-neutral-400">
        <Share2 className="h-5 w-5" />
        <span className="text-sm">Partager :</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Twitter */}
        <motion.a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare("Twitter")}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all group"
          aria-label="Partager sur Twitter"
        >
          <Twitter className="h-4 w-4 text-cyan-500" />
          <span className="text-sm text-neutral-300 group-hover:text-cyan-400 transition-colors">
            Twitter
          </span>
        </motion.a>

        {/* LinkedIn */}
        <motion.a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare("LinkedIn")}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all group"
          aria-label="Partager sur LinkedIn"
        >
          <Linkedin className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-neutral-300 group-hover:text-blue-400 transition-colors">
            LinkedIn
          </span>
        </motion.a>

        {/* Facebook */}
        <motion.a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleShare("Facebook")}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-blue-600/40 hover:bg-blue-600/10 transition-all group"
          aria-label="Partager sur Facebook"
        >
          <Facebook className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-neutral-300 group-hover:text-blue-500 transition-colors">
            Facebook
          </span>
        </motion.a>

        {/* Copy Link */}
        <motion.button
          onClick={handleCopyLink}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-mint/40 hover:bg-mint/10 transition-all group"
          aria-label="Copier le lien"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-mint" />
              <span className="text-sm text-mint">Copié !</span>
            </>
          ) : (
            <>
              <LinkIcon className="h-4 w-4 text-neutral-400 group-hover:text-mint transition-colors" />
              <span className="text-sm text-neutral-300 group-hover:text-mint transition-colors">
                Copier
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// Compact version for cards
export function SocialShareCompact({
  url,
  title,
  contentType = "page",
}: Pick<SocialShareProps, "url" | "title" | "contentType">) {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-mint/40 transition-colors"
        aria-label="Partager"
      >
        <Share2 className="h-5 w-5 text-neutral-400" />
      </motion.button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Share menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute right-0 top-full mt-2 z-50 p-3 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl min-w-[200px]"
          >
            <SocialShare
              url={shareUrl}
              title={title}
              contentType={contentType}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
