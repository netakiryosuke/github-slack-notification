import { config } from "./config.js";
import { GithubClient } from "./githubClient.js";
import type { Notification } from "./githubClient.js";
import { SlackClient } from "./slackClient.js";

const githubClient = new GithubClient();
const slackClient = new SlackClient();

function buildMessage(
  notification: Notification,
): string {
  const emojiMap: Record<string, string> = {
    mention: "📢",
    review_requested: "👀",
    comment: "💬",
  };

  const emoji = emojiMap[notification.reason] ?? "🔔";

  return [
    `${emoji} GitHub Notification`,
    "",
    `Repository: ${notification.repository.full_name}`,
    `Reason: ${notification.reason}`,
    `Type: ${notification.subject.type}`,
    "",
    `Title:`,
    notification.subject.title,
    "",
    notification.subject.url,
  ].join("\n");
}

async function main(): Promise<void> {
  const notifications = await githubClient.getNotifications();

  const targets = notifications.filter(
    (notification) =>
      notification.unread &&
      config.targetReasons.includes(
        notification.reason as never,
      ),
  );

  console.log(
    `Found ${targets.length} notifications`,
  );

  for (const notification of targets) {
    try {
      const message = buildMessage(notification);

      await slackClient.send(message);

      await githubClient.markThreadAsRead(
        notification.id,
      );

      console.log(
        `Processed notification ${notification.id}`,
      );
    } catch (error) {
      console.error(
        `Failed notification ${notification.id}`,
        error,
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
