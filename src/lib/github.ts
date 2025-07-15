// GitHub API 相关配置和工具函数
// 请将下面的占位符替换为你的实际仓库信息和GitHub Token

// GitHub 配置
const GITHUB_CONFIG = {
  // 替换为你的 GitHub 用户名和仓库名
  owner: process.env.GITHUB_OWNER || 'sedationh',
  repo: process.env.GITHUB_REPO || 'blog',
  // 替换为你的 GitHub Personal Access Token
  // 在 https://github.com/settings/tokens 创建
  token: process.env.GITHUB_TOKEN || '<your-github-token>',
}

// Issue 数据类型定义
export interface Issue {
  id: number
  number: number
  title: string
  body: string
  created_at: string
  updated_at: string
  html_url: string
  user: {
    login: string
    avatar_url: string
  }
}

// 获取所有 Issues
export async function getAllIssues(): Promise<Issue[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues?state=open&per_page=100`,
      {
        headers: {
          'Authorization': `token ${GITHUB_CONFIG.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`)
    }
    
    const issues = await response.json()
    
    // 过滤掉 Pull Requests（GitHub API 会将 PR 也当作 Issue 返回）
    return issues.filter((issue: any) => !issue.pull_request)
  } catch (error) {
    console.error('Failed to fetch issues:', error)
    return []
  }
}

// 根据 Issue 编号获取单个 Issue
export async function getIssueByNumber(issueNumber: number): Promise<Issue | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues/${issueNumber}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_CONFIG.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`)
    }
    
    const issue = await response.json()
    
    // 确保不是 Pull Request
    if (issue.pull_request) {
      return null
    }
    
    return issue
  } catch (error) {
    console.error('Failed to fetch issue:', error)
    return null
  }
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
} 