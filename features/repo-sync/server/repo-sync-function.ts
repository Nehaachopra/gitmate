import { inngest } from "@/features/inngest/client";
import { prisma } from "@/lib/db";
import {
  buildRepoNamespace,
  chunkRepoFiles,
  deleteRepoNamespace,
  getRepoFiles,
  saveRepoChunks,
} from "@/features/repo-sync/server/repo-sync";

export const syncRepoCodebaseFunction = inngest.createFunction(
  {
    id: "sync-repo-codebase",
    triggers: { event: "repo/sync.requested" },
    onFailure: async ({ event }) => {
      await prisma.repoSync.update({
        where: { id: event.data.event.data.repoSyncId },
        data: { status: "failed" },
      });
    },
  },

  async ({ event, step }) => {
    
    const repoSyncId = event.data.repoSyncId;

    const repoSync = await step.run("mark-syncing", async () => {
      console.log("Mark syncing in db");
      return prisma.repoSync.update({
        where: { id: repoSyncId },
        data: { status: "syncing" },
      });
    });

    
    const chunks = await step.run("fetch-and-chunk-codebase", async () => {
      console.log("fetching and chunking codebase");
      const files = await getRepoFiles(
        repoSync.installationId,
        repoSync.repoFullName,
        repoSync.branch,
      );

      return chunkRepoFiles(files);
    });

    const namespace = buildRepoNamespace(repoSync.repoFullName);

    if (repoSync.syncedAt) {
      await step.run("delete-old-vectors", async () => {
        console.log("Deleting old vectors in pinecone");
        await deleteRepoNamespace(namespace);
      });
    }

    
    await step.run("save-vectors-to-pinecone", async () => {
      console.log("Saving vectors in pinecone");
      await saveRepoChunks(namespace, chunks);
    });

    
    await step.run("mark-synced", async () => {
      console.log("Marking synced in database");
      await prisma.repoSync.update({
        where: { id: repoSyncId },
        data: {
          status: "synced",
          syncedAt: new Date(),
          chunkCount: chunks.length,
        },
      });
    });

    return {
      repoSyncId,
      status: "synced",
      chunkCount: chunks.length,
    };
  },
);
