import { config } from "./config.js";
import { GithubClient } from "./githubClient.js";
import { SlackClient } from "./slackClient.js";

const githubClient = new GithubClient();
const slackClient = new SlackClient();

const getNotificationTitle = (
  reason: string,
): string => {
  switch (reason) {
    case "review_requested":
      return "👀 レビュー依頼";

    case "mention":
      return "📢 メンション";

    case "comment":
      return "💬 コメント";

    case "author":
      return "📝 更新通知";

    default:
      return "🔔 GitHub通知";
  }
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
      await slackClient.send({
        title: getNotificationTitle(
          notification.reason,
        ),
        notificationTitle:
          notification.subject.title,
        repository:
          notification.repository.full_name,
        type: notification.subject.type,
        githubUrl: notification.subject.url,
      });

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
