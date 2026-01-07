import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-blue max-w-none">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-blue-100 mb-6 border-b border-slate-700 pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-blue-300 mt-8 mb-4 flex items-center gap-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-medium text-blue-200 mt-6 mb-3" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 text-slate-300 my-4" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-2 text-slate-300 my-4" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          strong: ({node, ...props}) => <strong className="text-blue-200 font-bold" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic text-slate-400 bg-slate-800/50 rounded-r my-6" {...props} />,
          code: ({node, inline, className, children, ...props}: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <div className="relative group">
                <pre className="bg-slate-950/80 p-4 rounded-lg overflow-x-auto border border-slate-800 my-4 text-sm text-blue-200 font-mono shadow-inner">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          table: ({node, ...props}) => <div className="overflow-x-auto my-6 rounded-lg border border-slate-700"><table className="w-full text-left text-sm text-slate-300" {...props} /></div>,
          thead: ({node, ...props}) => <thead className="bg-slate-800 text-slate-200 uppercase" {...props} />,
          th: ({node, ...props}) => <th className="px-6 py-3 border-b border-slate-700 font-semibold" {...props} />,
          td: ({node, ...props}) => <td className="px-6 py-4 border-b border-slate-800" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
