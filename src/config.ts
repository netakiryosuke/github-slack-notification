export const config = {
  githubToken: process.env.GH_PAT!,
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL!,

  targetReasons: [
    "mention",
    "review_requested",
    "comment",
  ],
} as const;

if (!config.githubToken) {
  throw new Error("GH_PAT is not set");
}

if (!config.slackWebhookUrl) {
  throw new Error("SLACK_WEBHOOK_URL is not set");
}
