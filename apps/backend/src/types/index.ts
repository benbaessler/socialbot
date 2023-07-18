import { EmbedBuilder } from "discord.js";

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