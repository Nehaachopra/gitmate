import { App, Octokit } from "octokit";
let githubApp: App | null = null;

export function getGithubApp() {
  if (!githubApp) {
    githubApp = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      webhooks: {
        secret: process.env.GITHUB_APP_WEBHOOK_SECRET!,
      },
      Octokit: Octokit.defaults({
        request: {
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      }),
    });
  }

  return githubApp;
}

export function getGithubInstallUrl(userId: string) {
  const url = new URL(
    `https://github.com/apps/git-mate-pr-reviewer/installations/new`,
  );
  // `state` round-trips through GitHub so we can link the installation to this user.
  url.searchParams.set("state", userId);
  return url.toString();
}
