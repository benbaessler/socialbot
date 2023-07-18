import { EmbedBuilder } from "discord.js";

// Database
export interface IInstance {
  guildId: string;
  channelId: string;
  handle: string;
  profileId: string;
  ownedBy: string;
  includeMirrors: boolean;
  includeInteractions: boolean;
  mention: boolean;
  webhookUrl: string;
}

export interface IStats {
  guildId: string;
  joinedAt: Date;
  postsPosted: number;
  commentsPosted: number;
  mirrorsPosted: number;
  collectsPosted: number;
  commandsUsed: number;
}

export interface ILog {
  topics: string[];
  data: string;
}

export interface IPayload {
  username: string;
  avatar_url: string;
  content: string;
  embeds: EmbedBuilder[];
}