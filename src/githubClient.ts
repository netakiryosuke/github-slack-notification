import { config } from "./config.js";

export interface Notification {
  id: string;
  unread: boolean;
  reason: string;

  subject: {
    title: string;
    url: string | null;
    type: string;
  };

  repository: {
    full_name: string;
  };

  url: string;
}

export interface PullRequestDetail {
  html_url: string;
}

export class GithubClient {
  private readonly headers = {
    Authorization: `Bearer ${config.githubToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
  };

  async getNotifications(): Promise<Notification[]> {
    const response = await fetch(
      "https://api.github.com/notifications",
      {
        headers: this.headers,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get notifications: ${response.status}`,
      );
    }

    return response.json();
  }

  async getSubjectHtmlUrl(
    subjectApiUrl: string,
  ): Promise<string | undefined> {
    const response = await fetch(subjectApiUrl, {
      headers: this.headers,
    });

    if (!response.ok) {
      return undefined;
    }

    const body = (await response.json()) as PullRequestDetail;

    return body.html_url;
  }

  async markThreadAsRead(
    threadId: string,
  ): Promise<void> {
    const response = await fetch(
      `https://api.github.com/notifications/threads/${threadId}`,
      {
        method: "PATCH",
        headers: this.headers,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to mark thread as read: ${response.status}`,
      );
    }
  }
}