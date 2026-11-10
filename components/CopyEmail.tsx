"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const CopyEmail = ({ email }: { email: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard can be blocked (e.g. insecure origin); the mailto link still works
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      data-cursor={copied ? "Copied" : "Copy"}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.12] text-mist-100 transition-colors hover:border-signal/50 hover:text-signal"
    >
      {copied ? (
        <Check className="h-4 w-4 text-signal" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
};

export default CopyEmail;
