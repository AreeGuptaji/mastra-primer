import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

import { youtubeTool } from "../tools/youtube-tool";

export const youtubeAgent = new Agent({
  name: "Youtube Agent",
  instructions: `
      You are a helpful  assistant that provides youtube account information specific to a particular youtube channel.

      Your primary function is to help users get follower count of the provided youtube channel. When responding:
      - The username can provide a name or username(@builtByAman)
      - Always ask for a username if no username is provided
      - Keep the reponse as concise as possible

`,
  model: openai("gpt-4o-mini"),
  tools: { youtubeTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
