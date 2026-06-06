import { config } from "./config.js";
import { GithubClient } from "./githubClient.js";
import type { Notification } from "./githubClient.js";
import { SlackClient } from "./slackClient.js";

const githubClient = new GithubClient();
const slackClient = new SlackClient();

function buildMessage(
  notification: Notification,
  htmlUrl?: string,
): string {
  const emojiMap: Record<string, string> = {
    mention: "📢",
    review_requested: "👀",
    comment: "💬",
  };

  const emoji = emojiMap[notification.reason] ?? "🔔";

  const link = htmlUrl
    ? `URL:\n${htmlUrl}`
    : "URL:\n(取得不可)";

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
    link,
  ].join("\n");
}

async function main(): Promise<void> {
  const notifications =
    await githubClient.getNotifications();

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
      const htmlUrl = notification.subject.url
        ? await githubClient.getSubjectHtmlUrl(
          notification.subject.url,
        )
        : undefined;

      const message = buildMessage(
        notification,
        htmlUrl,
      );

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
