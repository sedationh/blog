// GitHub API related configurations and utility functions
// Please replace the placeholders below with your actual repository information and GitHub Token

// GitHub Configuration
const GITHUB_CONFIG = {
  // Replace with your GitHub username and repository name
  owner: process.env.GITHUB_OWNER || 'sedationh',
  repo: process.env.GITHUB_REPO || 'blog',
  // Replace with your GitHub Personal Access Token
  // Create one at https://github.com/settings/tokens
  token: process.env.GITHUB_TOKEN || '<your-github-token>',
}

// Issue data type definition
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

// User data type definition
export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
}

// Get GitHub user information
export async function getGitHubUser(): Promise<GitHubUser | null> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_CONFIG.owner}`,
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
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch GitHub user:', error)
    return null
  }
}

// Get all Issues
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
    
    // Filter out Pull Requests (GitHub API returns PRs as Issues too)
    return issues.filter((issue: any) => !issue.pull_request)
  } catch (error) {
    console.error('Failed to fetch issues:', error)
    return []
  }
}

// Get a single Issue by issue number
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
    
    // Ensure it's not a Pull Request
    if (issue.pull_request) {
      return null
    }
    
    return issue
  } catch (error) {
    console.error('Failed to fetch issue:', error)
    return null
  }
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
} 