"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

// 语言映射表，用于显示更友好的语言名称
const languageMap: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  jsx: "React JSX",
  tsx: "React TSX",
  py: "Python",
  python: "Python",
  java: "Java",
  cpp: "C++",
  c: "C",
  cs: "C#",
  csharp: "C#",
  php: "PHP",
  rb: "Ruby",
  ruby: "Ruby",
  go: "Go",
  rust: "Rust",
  swift: "Swift",
  kotlin: "Kotlin",
  dart: "Dart",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sass: "Sass",
  less: "Less",
  json: "JSON",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
  toml: "TOML",
  ini: "INI",
  sh: "Shell",
  bash: "Bash",
  zsh: "Zsh",
  fish: "Fish",
  powershell: "PowerShell",
  sql: "SQL",
  mongodb: "MongoDB",
  redis: "Redis",
  graphql: "GraphQL",
  markdown: "Markdown",
  md: "Markdown",
  tex: "LaTeX",
  latex: "LaTeX",
  r: "R",
  matlab: "MATLAB",
  scala: "Scala",
  clojure: "Clojure",
  elixir: "Elixir",
  elm: "Elm",
  haskell: "Haskell",
  lua: "Lua",
  perl: "Perl",
  vim: "Vim Script",
};

// 自定义深色样式
const customStyle = {
  margin: 0,
  padding: "1.5rem",
  backgroundColor: "#1e1e1e",
  fontSize: "0.875rem",
  lineHeight: "1.6",
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // 从 className 中提取语言（例如 "language-javascript"）
  const extractLanguage = () => {
    if (language) return language;
    if (className) {
      const match = className.match(/(?:language-|lang-)(\w+)/);
      return match ? match[1] : "";
    }
    return "";
  };

  const lang = extractLanguage();
  const displayLanguage =
    languageMap[lang.toLowerCase()] || lang.toUpperCase() || "CODE";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative group my-6">
      {/* 代码块容器 */}
      <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
        {/* 代码块头部 */}
        <div className="flex items-center justify-between bg-gray-800 px-3 py-2 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            {/* macOS 风格圆点 */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
            </div>

            {/* 语言标签 */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-300 font-medium">
                {displayLanguage}
              </span>
            </div>
          </div>

          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            className={clsx(
              "flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              "hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
              copied
                ? "text-green-400 bg-green-900/30 border border-green-700"
                : "text-gray-400 hover:text-gray-200 border border-gray-600 hover:border-gray-500"
            )}
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                <span>Copied</span>
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5,15H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H13a2,2,0,0,1,2,2V5"></path>
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* 语法高亮代码内容 */}
        <div className="relative">
          <SyntaxHighlighter
            language={lang || "text"}
            style={dracula}
            customStyle={customStyle}
            showLineNumbers={false}
            wrapLines={true}
          >
            {children}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

// 行内代码组件
export function InlineCode({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <code
      className={clsx(
        "bg-gray-800 text-green-200 px-2 py-1 rounded font-mono text-sm border border-gray-600",
        className
      )}
    >
      {children}
    </code>
  );
}
