import Link from 'next/link'
import { getAllIssues, formatDate } from '@/lib/github'

export default async function Home() {
  // App Router中可以直接在组件中使用async/await获取数据
  const issues = await getAllIssues()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">我的博客</h1>
          <p className="text-gray-600 mt-2">基于 GitHub Issues 的简单博客系统</p>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {issues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">暂无文章</p>
            <p className="text-gray-400 text-sm mt-2">
              请在 GitHub 仓库中创建 Issues 来发布文章
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <article
                key={issue.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="flex-1">
                  <Link 
                    href={`/detail/${issue.number}`}
                    className="block group"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {issue.title}
                    </h2>
                  </Link>
                  
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <img
                      src={issue.user.avatar_url}
                      alt={issue.user.login}
                      className="w-5 h-5 rounded-full mr-2"
                    />
                    <span className="mr-4">@{issue.user.login}</span>
                    <time>{formatDate(issue.created_at)}</time>
                  </div>
                  
                  {/* 文章预览 */}
                  {issue.body && (
                    <p className="text-gray-600 mt-3 text-sm line-clamp-3">
                      {issue.body.substring(0, 120)}
                      {issue.body.length > 120 ? '...' : ''}
                    </p>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link 
                    href={`/detail/${issue.number}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    阅读更多 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            Powered by{' '}
            <a 
              href="https://nextjs.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Next.js
            </a>{' '}
            & GitHub Issues
          </p>
        </div>
      </footer>
    </div>
  )
}
