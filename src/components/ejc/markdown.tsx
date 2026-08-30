'use client';

import ReactMarkdown from 'react-markdown';

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`text-sm leading-relaxed [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-[15px] [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_table]:my-3 [&_table]:w-full [&_table]:text-xs [&_table]:table-fixed [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1.5 [&_td]:align-top [&_hr]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-amber-500/60 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs ${className ?? ''}`}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
