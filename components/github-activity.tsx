"use client"

import { useEffect, useState } from "react"

interface GitHubEvent {
  id: string
  type: string
  repo: { name: string }
  created_at: string
  payload: {
    commits?: { message: string }[]
    action?: string
    ref_type?: string
    ref?: string
    size?: number
  }
}

interface GitHubActivityProps {
  username: string
  limit?: number
}

export function GitHubActivity({ username, limit = 5 }: GitHubActivityProps) {
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=${limit * 2}`
        )
        if (response.ok) {
          const data = await response.json()
          // Filter to show only meaningful events
          const filtered = data
            .filter((e: GitHubEvent) => {
              if (e.type === "PushEvent") {
                return (e.payload.size || e.payload.commits?.length || 0) > 0
              }
              return ["CreateEvent", "WatchEvent", "ForkEvent", "PullRequestEvent", "IssuesEvent"].includes(e.type)
            })
            .slice(0, limit)
          setEvents(filtered)
        }
      } catch (error) {
        console.error("Error fetching GitHub activity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [username, limit])

  const formatEvent = (event: GitHubEvent): string => {
    const repoName = event.repo.name.replace(`${username}/`, "")
    
    switch (event.type) {
      case "PushEvent":
        const commits = event.payload.size || event.payload.commits?.length || 0
        return `Pushed ${commits} commit${commits !== 1 ? "s" : ""} to ${repoName}`
      case "CreateEvent":
        if (event.payload.ref_type === "repository") {
          return `Created repository ${repoName}`
        }
        return `Created ${event.payload.ref_type} ${event.payload.ref || ""} in ${repoName}`
      case "WatchEvent":
        return `Starred ${repoName}`
      case "ForkEvent":
        return `Forked ${repoName}`
      case "IssuesEvent":
        return `${capitalize(event.payload.action || "")} issue in ${repoName}`
      case "PullRequestEvent":
        return `${capitalize(event.payload.action || "")} PR in ${repoName}`
      case "IssueCommentEvent":
        return `Commented on issue in ${repoName}`
      default:
        return `Activity in ${repoName}`
    }
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return `${Math.floor(days / 7)}w ago`
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-16 mt-1" />
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No recent activity</p>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="group">
          <p className="text-sm text-foreground group-hover:text-primary transition-colors">
            {formatEvent(event)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatTime(event.created_at)}
          </p>
        </div>
      ))}
      
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-xs font-mono text-muted-foreground hover:text-primary transition-colors mt-2"
      >
        View all activity →
      </a>
    </div>
  )
}
