import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { getIssueByNumber, formatDate } from '@/lib/github'

interface DetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params
  const issueNumber = parseInt(id, 10)
  
  if (isNaN(issueNumber)) {
    notFound()
  }

  const issue = await getIssueByNumber(issueNumber)

  if (!issue) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </nav>

      {/* 文章内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* 文章头部 */}
          <header className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {issue.title}
            </h1>
            
            <div className="flex items-center text-sm text-gray-500">
              <img
                src={issue.user.avatar_url}
                alt={issue.user.login}
                className="w-8 h-8 rounded-full mr-3"
              />
              <div>
                <div className="font-medium text-gray-700">@{issue.user.login}</div>
                <div className="flex items-center mt-1">
                  <span>发布于 {formatDate(issue.created_at)}</span>
                  {issue.updated_at !== issue.created_at && (
                    <span className="ml-3">更新于 {formatDate(issue.updated_at)}</span>
                  )}
                </div>
              </div>
              
              <div className="ml-auto">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  在 GitHub 查看
                </a>
              </div>
            </div>
          </header>

          {/* 文章正文 */}
          <div className="px-6 py-8">
            {issue.body ? (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // 自定义 Markdown 组件样式
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold text-gray-900 mb-2 mt-5">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 text-gray-600 italic">
                        {children}
                      </blockquote>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-gray-700">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 text-gray-700">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    img: ({ src, alt, width, height, ...props }) => (
                      <img 
                        src={src} 
                        alt={alt || 'Image'} 
                        className="max-w-full h-auto rounded-lg shadow-sm my-4 mx-auto block"
                        loading="lazy"
                        {...props}
                      />
                    ),
                  }}
                >
                  {issue.body}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">此文章暂无内容</p>
            )}
          </div>
        </article>

        {/* 返回按钮 */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回文章列表
          </Link>
        </div>
      </main>
    </div>
  )
}

// App Router 中可以使用 generateStaticParams 来实现 SSG
export async function generateStaticParams() {
  try {
    const { getAllIssues } = await import('@/lib/github')
    const issues = await getAllIssues()
    
    return issues.map((issue) => ({
      id: issue.number.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// 为每个页面生成元数据
export async function generateMetadata({ params }: DetailPageProps) {
  const { id } = await params
  const issueNumber = parseInt(id, 10)
  
  if (isNaN(issueNumber)) {
    return {
      title: '文章未找到 - 我的博客',
    }
  }

  try {
    const issue = await getIssueByNumber(issueNumber)
    
    if (!issue) {
      return {
        title: '文章未找到 - 我的博客',
      }
    }

    return {
      title: `${issue.title} - 我的博客`,
      description: issue.body ? issue.body.substring(0, 160) : issue.title,
    }
  } catch (error) {
    return {
      title: '文章未找到 - 我的博客',
    }
  }
} 