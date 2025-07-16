"use client";

import { clsx } from "clsx";
import type { MarkdownToJSX } from "markdown-to-jsx";
import { compiler } from "markdown-to-jsx";
import type { FC, PropsWithChildren } from "react";
import React, { memo, Suspense, useMemo } from "react";
import { MarkdownImage, MarkdownImageProvider } from "./MarkdownImage";
import { CodeBlock, InlineCode } from "./CodeBlock";

interface MarkdownProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
  overrides?: Partial<MarkdownToJSX.Overrides>;
}

// 简化的错误边界组件
function MarkdownErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div className="markdown-error-boundary">{children}</div>;
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

    if (typeof mdContent !== "string") {
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
          <p className="text-gray-700 mb-4 leading-relaxed last:mb-0">
            {children}
          </p>
        ),

        hr: () => <hr className="my-4 border-t-2 border-gray-200" />,

        // 代码块处理 - 直接处理 code 元素
        code: ({ children, className: codeClassName, ...props }) => {
          // 检查是否是代码块中的 code（支持 language- 和 lang- 前缀）
          if (
            (codeClassName &&
              (codeClassName.includes("language-") ||
                codeClassName.includes("lang-"))) ||
            (typeof children === "string" && children?.includes("\n"))
          ) {
            // 提取语言信息 - 支持多种格式
            const languageMatch = codeClassName?.match(
              /(?:language-|lang-)(\w+)/
            );
            const language = languageMatch ? languageMatch[1] : "";

            return (
              <CodeBlock language={language} className={codeClassName}>
                {String(children)}
              </CodeBlock>
            );
          }

          // 普通行内代码
          return (
            <InlineCode className={codeClassName}>
              {String(children)}
            </InlineCode>
          );
        },

        // 简化的 pre 处理
        pre: ({ children, ...props }) => {
          // 如果包含我们的 CodeBlock，直接返回
          if (
            React.isValidElement(children) &&
            (children as any).type === CodeBlock
          ) {
            return children;
          }

          // 默认 pre 处理
          return (
            <pre
              className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm"
              {...props}
            >
              {children}
            </pre>
          );
        },

        // 引用
        blockquote: ({ children }) => {
          // 检查是否包含 header 元素来确定是否是特殊的注释块
          const hasHeader = React.Children.toArray(children).some(
            (child) => React.isValidElement(child) && child.type === "header"
          );

          if (hasHeader) {
            // 特殊的注释块样式（如 NOTE, WARNING 等）
            return (
              <blockquote className="border border-blue-200 bg-blue-50 rounded-lg p-4 my-6 [&_header]:text-blue-800 [&_header]:font-semibold [&_header]:text-sm [&_header]:uppercase [&_header]:tracking-wider [&_header]:mb-3 [&_p]:text-gray-700 [&_p]:mb-3 [&_ol]:text-gray-700 [&_ol]:not-italic [&_ul]:text-gray-700 [&_ul]:not-italic">
                {children}
              </blockquote>
            );
          }

          // 普通引用块样式
          return (
            <blockquote className="border-l-4 border-blue-500 pl-4 my-4 text-gray-600 bg-gray-50 py-2 rounded-r-md">
              {children}
            </blockquote>
          );
        },

        // 列表
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-6 mb-4 text-gray-700 space-y-2 [&_ul]:mt-2 [&_ul]:mb-2 [&_ol]:mt-2 [&_ol]:mb-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-6 mb-4 text-gray-700 space-y-2 [&_ul]:mt-2 [&_ul]:mb-2 [&_ol]:mt-2 [&_ol]:mb-2 last:mb-0">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="mb-2 pl-2 leading-relaxed [&>ul]:list-[circle] [&>ol]:list-[lower-alpha] [&_ul]:ml-4 [&_ol]:ml-4">
            {children}
          </li>
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
            // GitHub 的图片 alt 是 image，这里需要处理一下
            alt={alt === "image" ? "" : alt || "Image"}
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
          <thead className="bg-gray-50">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-white divide-y divide-gray-200">
            {children}
          </tbody>
        ),
        tr: ({ children }) => <tr>{children}</tr>,
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

        // Header 元素（用于 blockquote 中的标题）
        header: ({ children }) => (
          <header className="text-blue-800 font-semibold text-sm uppercase tracking-wider mb-3 block">
            {children}
          </header>
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
      <Suspense
        fallback={<div className="text-gray-500">Loading content...</div>}
      >
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

Markdown.displayName = "Markdown";
