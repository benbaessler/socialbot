import { EmbedBuilder } from "discord.js";
import { MomokaTransaction } from "../generated";

export interface IPayload {
  username: string;
  avatar_url: string;
  content: string;
  embeds: EmbedBuilder[];
}

export interface IMomokaTransaction {
  data: {
    newMomokaTransaction: MomokaTransaction;
  };
}
