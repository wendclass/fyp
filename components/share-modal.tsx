"use client";

import { useState } from "react";
import { Copy, Check, Share2, MessageCircle, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface ShareModalProps {
  shareToken: string;
  recipientName: string;
  occasion?: string;
}

export function ShareModal({ shareToken, recipientName, occasion }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/s/${shareToken}`;
    }
    return `https://fyp-gift.vercel.app/s/${shareToken}`;
  };

  const shareUrl = getShareUrl();
  const shareMessage = `Coucou ${recipientName} ! 🎁 Réponds à ces 3 petites questions rapides pour m\u2019aider à te préparer une surprise : ${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank");
  };

  const handleMessenger = () => {
    const url = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Surprise pour ${recipientName} 🎁`,
          text: `Réponds à ces 3 petites questions pour me guider !`,
          url: shareUrl,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-blush-200/80 shadow-soft-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-fuchsia-brand/10 text-fuchsia-brand flex items-center justify-center">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-charcoal">
            Lien secret à envoyer à {recipientName}
          </h3>
          <p className="text-xs text-charcoal-muted">
            {recipientName} ne verra jamais votre budget ni les idées de cadeaux.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-blush-50 rounded-2xl border border-blush-200 mb-6">
        <div className="flex-1 px-3 py-2 text-sm font-mono text-charcoal truncate select-all">
          {shareUrl}
        </div>
        <Button
          type="button"
          onClick={handleCopy}
          variant={copied ? "secondary" : "primary"}
          size="sm"
          className="whitespace-nowrap"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Copié ! ✨</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copier le lien</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-semibold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4" />
          Partager sur WhatsApp
        </button>

        <button
          type="button"
          onClick={handleMessenger}
          className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-display font-semibold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ExternalLink className="w-4 h-4" />
          Partager sur Messenger
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-blush-100 flex items-center justify-between text-xs text-charcoal-muted">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-brand" />
          Le lien reste actif jusqu'à ce que {recipientName} réponde.
        </span>
        {typeof navigator !== "undefined" && (navigator as any).share && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="text-fuchsia-brand font-medium hover:underline"
          >
            Autres options...
          </button>
        )}
      </div>
    </div>
  );
}
