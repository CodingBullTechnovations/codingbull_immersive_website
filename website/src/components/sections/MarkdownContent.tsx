import Link from 'next/link';
import { CodeBlock } from '@/components/sections/CodeBlock';

export interface ContentBlock {
  type: 'paragraph' | 'h2' | 'h3' | 'list' | 'code' | 'blockquote';
  items?: string[];
  lang?: string;
  text?: string;
}

export function parseMarkdownToBlocks(content: string): ContentBlock[] {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let currentCodeBlock: { lang: string; lines: string[] } | null = null;
  let currentListBlock: { items: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (currentListBlock) {
        blocks.push({ type: 'list', items: currentListBlock.items });
        currentListBlock = null;
      }

      if (currentCodeBlock) {
        blocks.push({
          type: 'code',
          lang: currentCodeBlock.lang,
          text: currentCodeBlock.lines.join('\n'),
        });
        currentCodeBlock = null;
      } else {
        const lang = trimmed.slice(3).trim() || 'typescript';
        currentCodeBlock = { lang, lines: [] };
      }
      continue;
    }

    if (currentCodeBlock) {
      currentCodeBlock.lines.push(line);
      continue;
    }

    if (!trimmed) continue;

    if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      currentListBlock ??= { items: [] };
      currentListBlock.items.push(trimmed);
      continue;
    }

    if (currentListBlock) {
      blocks.push({ type: 'list', items: currentListBlock.items });
      currentListBlock = null;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3) });
    } else if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4) });
    } else if (trimmed.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: trimmed.slice(2) });
    } else {
      blocks.push({ type: 'paragraph', text: trimmed });
    }
  }

  if (currentListBlock) {
    blocks.push({ type: 'list', items: currentListBlock.items });
  }
  if (currentCodeBlock) {
    blocks.push({
      type: 'code',
      lang: currentCodeBlock.lang,
      text: currentCodeBlock.lines.join('\n'),
    });
  }

  return blocks;
}

export function generateHeadingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function renderInline(text: string) {
  return text.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      if (href.startsWith('/')) {
        return (
          <Link key={index} href={href} className="font-medium text-teal no-underline hover:underline">
            {label}
          </Link>
        );
      }
      return (
        <a key={index} href={href} className="font-medium text-teal no-underline hover:underline" rel="noreferrer" target="_blank">
          {label}
        </a>
      );
    }

    return part;
  });
}

export function MarkdownContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none
        prose-headings:font-[family-name:var(--font-outfit)] prose-headings:tracking-tight
        prose-p:text-white/70 prose-p:leading-relaxed prose-p:font-light prose-p:mb-6 prose-p:text-base md:prose-p:text-lg
        prose-strong:text-white prose-strong:font-semibold
        prose-code:text-teal prose-code:bg-teal/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-a:text-teal prose-a:no-underline hover:prose-a:underline"
    >
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h2': {
            const headingId = generateHeadingId(block.text || '');
            return (
              <h2
                key={idx}
                id={headingId}
                className="group/heading mt-12 mb-6 flex scroll-mt-24 items-center gap-2 font-[family-name:var(--font-outfit)] text-2xl font-bold text-white lg:text-3xl"
              >
                <span className="font-mono text-lg text-teal opacity-0 transition-opacity group-hover/heading:opacity-60">#</span>
                {renderInline(block.text || '')}
              </h2>
            );
          }
          case 'h3':
            return (
              <h3 key={idx} className="mt-8 mb-4 text-xl font-semibold text-white/95">
                {renderInline(block.text || '')}
              </h3>
            );
          case 'blockquote':
            return (
              <blockquote key={idx} className="my-8 rounded-r-xl border-l-2 border-teal bg-teal/[0.02] px-6 py-4 font-light italic text-white/85">
                {renderInline(block.text || '')}
              </blockquote>
            );
          case 'list':
            return (
              <ul key={idx} className="my-6 space-y-3 pl-2">
                {block.items?.map((item, itemIdx) => {
                  const isOrdered = /^\d+\.\s/.test(item);
                  const textOnly = isOrdered ? item.replace(/^\d+\.\s/, '') : item.replace(/^- \s*/, '');
                  return (
                    <li key={itemIdx} className="flex items-start gap-3">
                      {isOrdered ? (
                        <span className="mt-0.5 shrink-0 font-mono font-bold text-teal">{item.match(/^\d+/)?.[0]}.</span>
                      ) : (
                        <span className="mt-2.5 shrink-0 text-[10px] text-teal">•</span>
                      )}
                      <span className="font-light leading-relaxed text-white/70">{renderInline(textOnly)}</span>
                    </li>
                  );
                })}
              </ul>
            );
          case 'code':
            return <CodeBlock key={idx} code={block.text || ''} language={block.lang || 'typescript'} />;
          case 'paragraph':
          default: {
            const isLead = idx === 0 || (idx === 1 && blocks[0].type !== 'paragraph');
            return (
              <p
                key={idx}
                className={`mb-6 font-light leading-relaxed text-white/70 ${
                  isLead ? 'border-l-2 border-white/10 pl-4 text-lg font-normal text-white/90 md:text-xl' : 'text-base md:text-lg'
                }`}
              >
                {renderInline(block.text || '')}
              </p>
            );
          }
        }
      })}
    </div>
  );
}
