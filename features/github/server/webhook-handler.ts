import { savePullRequest } from "@/features/reviews/server/save-pull-request";
import { getGithubApp } from "../utils/github-app";
import { getUserIdByInstallationId } from "./installation";

const REVIEWABLE_ACTIONS = ["opened", "synchronize", "reopened"];
const REVIEW_JOB_URL = process.env.REVIEW_JOB_URL;

export type PullRequestWebhookPayload = {
  /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
  action: string;
  /** GitHub App installation that received the event */
  installation: { id: number };
  repository: { full_name: string };
  pull_request: {
    number: number;
    title: string;
    user: { login: string } | null;
    head: { sha: string };
    base: { ref: string };
  };
};

async function isSignatureValid(payload: string, signature: string | null) {
  if (!signature) {
    return false;
  }

  const app = getGithubApp();
  // Octokit wraps GitHub's webhook crypto — rejects forged payloads.
  return app.webhooks.verify(payload, signature);
}

function buildPullRequestJobPayload(event: PullRequestWebhookPayload, userId: string) {
  return {
    userId,
    installationId: event.installation.id,
    repository: event.repository.full_name,
    pullRequestNumber: event.pull_request.number,
    pullRequestTitle: event.pull_request.title,
    pullRequestAuthor: event.pull_request.user?.login ?? null,
    headSha: event.pull_request.head.sha,
    baseRef: event.pull_request.base.ref,
    action: event.action,
  };
}

async function triggerReviewJob(event: PullRequestWebhookPayload, userId: string) {
  if (!REVIEW_JOB_URL) {
    return;
  }

  await fetch(REVIEW_JOB_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(buildPullRequestJobPayload(event, userId)),
  });
}

export async function handleGithubWebhook(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const eventName = request.headers.get("x-github-event");

  const isValid = await isSignatureValid(payload, signature);
  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (eventName !== "pull_request") {
    return Response.json({ received: true });
  }

  const event = JSON.parse(payload) as PullRequestWebhookPayload;

  console.log("event", event);

  if (!REVIEWABLE_ACTIONS.includes(event.action)) {
    return Response.json({ received: true });
  }

  const pullRequest = await savePullRequest(event);

  return Response.json({ received: true });
}
