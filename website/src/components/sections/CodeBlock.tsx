'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="relative border border-white/[0.06] rounded-xl overflow-hidden bg-[#07070a] my-8 group/code shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.04] text-[10px] font-mono tracking-widest text-white/60 uppercase">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 cursor-pointer text-white/50"
          aria-label="Copy code block"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-teal" />
              <span className="text-teal font-semibold">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-[13px] font-mono leading-relaxed text-[#c4eafc] select-text">
        <code>{code}</code>
      </pre>
    </div>
  );
}
