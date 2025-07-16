'use client'

import { clsx } from 'clsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { compiler } from 'markdown-to-jsx'
import type { FC, PropsWithChildren } from 'react'
import { memo, Suspense, useMemo } from 'react'
import { MarkdownImage, MarkdownImageProvider } from './MarkdownImage'

interface MarkdownProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
  overrides?: Partial<MarkdownToJSX.Overrides>;
}

// 简化的错误边界组件
function MarkdownErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="markdown-error-boundary">
      {children}
    </div>
  );
}

export const Markdown: FC<MarkdownProps & PropsWithChildren> = memo((props) => {
  const {
    content,
    className = "",
    style,
    overrides,
    children,
    ...rest
  } = props;

  const node = useMemo(() => {
    const mdContent = content || children;

    if (!mdContent) {
      return (
        <p className="text-gray-500 italic">This article has no content</p>
      );
    }

    if (typeof mdContent !== 'string') {
      return null;
    }

    const mdElement = compiler(mdContent, {
      wrapper: null,
      
      overrides: {
        // 标题组件
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-gray-900 mb-3 mt-6">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold text-gray-900 mb-2 mt-5">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-bold text-gray-900 mb-2 mt-4">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-sm font-bold text-gray-900 mb-2 mt-3">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-xs font-bold text-gray-900 mb-2 mt-2">
            {children}
          </h6>
        ),

        // 段落
        p: ({ children }) => (
          <p className="text-gray-700 mb-4 leading-relaxed">
            {children}
          </p>
        ),

        hr: () => (
          <hr className="my-4 border-t-2 border-gray-200" />
        ),

        // 行内代码
        code: ({ children, className: codeClassName }) => {
          // 如果没有 className，说明是行内代码
          if (!codeClassName) {
            return (
              <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          }
          // 有 className 的话会被 pre 包裹处理
          return <code className={codeClassName}>{children}</code>;
        },

        // 代码块
        pre: ({ children }) => (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
            {children}
          </pre>
        ),

        // 引用
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 my-4 text-gray-600 italic">
            {children}
          </blockquote>
        ),

        // 列表
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-6 mb-4 text-gray-700 space-y-2 [&_ul]:mt-2 [&_ul]:mb-2 [&_ol]:mt-2 [&_ol]:mb-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-6 mb-4 text-gray-700 space-y-2 [&_ul]:mt-2 [&_ul]:mb-2 [&_ol]:mt-2 [&_ol]:mb-2">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="mb-2 pl-2 leading-relaxed [&>ul]:list-[circle] [&>ol]:list-[lower-alpha] [&_ul]:ml-4 [&_ol]:ml-4">{children}</li>
        ),

        // 链接
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-blue-600 hover:text-blue-800 underline decoration-blue-600/30 hover:decoration-blue-800/50 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),

        // 图片
        img: ({ src, alt, ...props }) => (
          <MarkdownImage
            src={src || ""}
            alt={alt || "Image"}
            {...props}
          />
        ),

        // 表格组件
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-200">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-white divide-y divide-gray-200">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr>{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
            {children}
          </td>
        ),

        // 标记文本
        mark: ({ children }) => (
          <mark className="bg-yellow-200 rounded-md">
            <span className="px-1">{children}</span>
          </mark>
        ),

        ...overrides,
      },
      
      ...rest,
    });

    return mdElement;
  }, [content, children, overrides, rest]);

  if (!node) {
    return null;
  }

  return (
    <MarkdownErrorBoundary>
      <Suspense fallback={<div className="text-gray-500">Loading content...</div>}>
        <MarkdownImageProvider>
          <div 
            className={clsx("prose prose-lg max-w-none", className)}
            style={style}
          >
            {node}
          </div>
        </MarkdownImageProvider>
      </Suspense>
    </MarkdownErrorBoundary>
  );
});

Markdown.displayName = 'Markdown'; 