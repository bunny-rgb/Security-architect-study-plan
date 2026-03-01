// GitHub integration for saving user progress data
// This will save user data to a private GitHub repository

import { User, UserProgress } from './auth'

const GITHUB_API_BASE = 'https://api.github.com'
const REPO_OWNER = process.env.GITHUB_OWNER || 'your-username' // Will be set via env
const REPO_NAME = 'secureedge-academy-data'
const BRANCH = 'main'

interface GitHubConfig {
  token: string
  owner: string
  repo: string
}

// Get GitHub token from environment or localStorage
const getGitHubConfig = (): GitHubConfig | null => {
  if (typeof window === 'undefined') return null
  
  // In production, token should come from secure backend
  // For now, we'll guide user to set up GitHub in settings
  const token = localStorage.getItem('github_token')
  if (!token) return null
  
  return {
    token,
    owner: REPO_OWNER,
    repo: REPO_NAME
  }
}

// Create repository if it doesn't exist
export const initializeGitHubRepo = async (): Promise<boolean> => {
  const config = getGitHubConfig()
  if (!config) return false
  
  try {
    // Check if repo exists
    const repoCheck = await fetch(
      `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}`,
      {
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )
    
    if (repoCheck.ok) return true
    
    // Create new private repository
    const createRepo = await fetch(
      `${GITHUB_API_BASE}/user/repos`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: config.repo,
          description: 'SecureEdge Academy - User Progress Data (Private)',
          private: true,
          auto_init: true
        })
      }
    )
    
    if (!createRepo.ok) {
      console.error('Failed to create GitHub repository:', await createRepo.text())
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error initializing GitHub repo:', error)
    return false
  }
}

// Save user data to GitHub
export const saveToGitHub = async (
  user: User,
  progress: UserProgress
): Promise<boolean> => {
  const config = getGitHubConfig()
  if (!config) {
    console.warn('GitHub not configured. Data saved locally only.')
    return false
  }
  
  try {
    const fileName = `users/${user.id}.json`
    const content = JSON.stringify({
      user,
      progress,
      lastSync: new Date().toISOString()
    }, null, 2)
    
    // Get file SHA if it exists (for updates)
    let sha: string | undefined
    const fileCheck = await fetch(
      `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/${fileName}`,
      {
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )
    
    if (fileCheck.ok) {
      const fileData = await fileCheck.json()
      sha = fileData.sha
    }
    
    // Create or update file
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/${fileName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update progress for ${user.name} - ${new Date().toLocaleString()}`,
          content: btoa(content), // Base64 encode
          branch: BRANCH,
          ...(sha && { sha }) // Include SHA for updates
        })
      }
    )
    
    if (!response.ok) {
      console.error('Failed to save to GitHub:', await response.text())
      return false
    }
    
    console.log('✅ Progress saved to GitHub successfully')
    return true
  } catch (error) {
    console.error('Error saving to GitHub:', error)
    return false
  }
}

// Load user data from GitHub
export const loadFromGitHub = async (userId: string): Promise<{
  user: User
  progress: UserProgress
} | null> => {
  const config = getGitHubConfig()
  if (!config) return null
  
  try {
    const fileName = `users/${userId}.json`
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/${fileName}`,
      {
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    const content = atob(data.content) // Base64 decode
    const userData = JSON.parse(content)
    
    return {
      user: userData.user,
      progress: userData.progress
    }
  } catch (error) {
    console.error('Error loading from GitHub:', error)
    return null
  }
}

// Export summary statistics to GitHub
export const exportSummaryToGitHub = async (): Promise<boolean> => {
  const config = getGitHubConfig()
  if (!config) return false
  
  try {
    // Get all user files
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/users`,
      {
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )
    
    if (!response.ok) return false
    
    const files = await response.json()
    const allUsers: any[] = []
    
    // Load all user data
    for (const file of files) {
      if (file.name.endsWith('.json')) {
        const userData = await loadFromGitHub(file.name.replace('.json', ''))
        if (userData) allUsers.push(userData)
      }
    }
    
    // Generate summary
    const summary = {
      totalUsers: allUsers.length,
      totalCompletedLessons: allUsers.reduce((sum, u) => sum + u.progress.completedLessons.length, 0),
      totalXP: allUsers.reduce((sum, u) => sum + u.progress.totalXP, 0),
      averageProgress: allUsers.reduce((sum, u) => sum + u.progress.completedLessons.length, 0) / allUsers.length,
      lastUpdated: new Date().toISOString(),
      topUsers: allUsers
        .sort((a, b) => b.progress.totalXP - a.progress.totalXP)
        .slice(0, 10)
        .map(u => ({
          name: u.user.name,
          xp: u.progress.totalXP,
          completedLessons: u.progress.completedLessons.length
        }))
    }
    
    // Save summary
    const content = JSON.stringify(summary, null, 2)
    await fetch(
      `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/summary.json`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update summary statistics - ${new Date().toLocaleString()}`,
          content: btoa(content),
          branch: BRANCH
        })
      }
    )
    
    return true
  } catch (error) {
    console.error('Error exporting summary:', error)
    return false
  }
}

// Setup instructions for users
export const getGitHubSetupInstructions = (): string => {
  return `
To enable GitHub backup:

1. Create a Personal Access Token (PAT):
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: repo (full control)
   - Copy the token

2. Save token in SecureEdge Academy:
   - Go to Profile → Settings
   - Paste your GitHub token
   - Click "Connect GitHub"

3. Your progress will be automatically saved to:
   - Private repository: ${REPO_NAME}
   - Format: JSON files per user
   - Automatic backups on lesson completion

Note: Your token is stored locally and never sent to our servers.
  `.trim()
}
