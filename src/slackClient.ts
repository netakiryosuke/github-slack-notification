import { config } from "./config.js";

export class SlackClient {
  async send(message: string): Promise<void> {
    const response = await fetch(
      config.slackWebhookUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
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
