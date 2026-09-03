'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  value: string;
  copyLabel: string;
  copiedLabel: string;
  className?: string;
}

export function CopyButton({ value, copyLabel, copiedLabel, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for older browsers / insecure contexts
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
        copied
          ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
          : 'border-amber-300/30 bg-white/[0.04] text-amber-200 hover:border-amber-300/60 hover:bg-white/10'
      } ${className}`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
