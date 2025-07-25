import { createTool } from "@mastra/core";
import dotenv from "dotenv";
import { z } from "zod";

interface ChannelData {
  id: string;
  title: string;
  subCount: number;
  photo: string;
}

dotenv.config();

const API_KEY = process.env.YOUTUBE_API_KEY;

export const youtubeTool = createTool({
  id: "get-youtube-data",
  description: "Get the channel data",
  inputSchema: z.object({
    channel: z.string(),
  }),
  outputSchema: z.object({
    id: z.string(),
    title: z.string(),
    subCount: z.number(),
    photo: z.string(),
  }),

  execute: async ({ context }) => {
    return await fetchChannelData(context.channel);
  },
});

async function fetchChannelData(channelId: string): Promise<ChannelData> {
  try {
    let endpoint = "https://www.googleapis.com/youtube/v3/channels?";

    if (channelId.startsWith("@")) {
      endpoint = `${endpoint}part=snippet,statistics&forHandle=${channelId.substring(1)}&key=${API_KEY}`;
    } else if (channelId.startsWith("@")) {
      endpoint = `${endpoint}part=snippet,statistics&id=${channelId.substring(1)}&key=${API_KEY}`;
    } else {
      endpoint = `${endpoint}part=snippet,statistics&forUsername=${channelId}&key=${API_KEY}`;
    }
    const response = await fetch(endpoint);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Youtube API error:" + data.error?.messsage);
    }
    if (!data.items || data.items.length == 0) {
      throw new Error("Channel not found");
    }
    const channel = data.items[0];

    return {
      id: channel.id,
      title: channel.snippet.title,
      photo: channel.snippet.thumbnails.medium.url,
      subCount: parseInt(channel.statistics.subscriberCount, 10),
    };
  } catch (error) {
    console.log("Error fetching channel data", error);
    throw error;
  }
}
