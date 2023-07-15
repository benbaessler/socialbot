import { EmbedBuilder } from "discord.js";

export interface Payload {
  username: string;
  avatar_url: string;
  content: string;
  embeds: EmbedBuilder[];
}