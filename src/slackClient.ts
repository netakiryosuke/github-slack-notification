import { config } from "./config.js";

export interface SlackMessage {
  title: string;
  notificationTitle: string;
  repository: string;
  type: string;
  githubUrl: string;
}

export class SlackClient {
  async send(payload: SlackMessage): Promise<void> {
    const blocks: object[] = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: payload.title,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${payload.notificationTitle}*`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Repository*\n${payload.repository}`,
          },
          {
            type: "mrkdwn",
            text: `*Type*\n${payload.type}`,
          },
        ],
      },
    ];

    if (payload.githubUrl) {
      blocks.push({
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Open GitHub",
            },
            url: payload.githubUrl,
          },
        ],
      });
    }

    const response = await fetch(
      config.slackWebhookUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blocks,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Slack webhook failed: ${response.status}`,
      );
    }
  }
}