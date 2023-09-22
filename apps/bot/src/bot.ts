import { initializeEvents } from "./handlers/events";
import mongoose from "mongoose";
import { Client, GatewayIntentBits } from "discord.js";
import { token, useMainnet, dbConnectionString } from "./constants";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export default async function start() {
  await mongoose.connect(dbConnectionString!, { keepAlive: true });
  await initializeEvents(client);

  console.log(`Running on ${useMainnet ? "mainnet" : "testnet"}`);
  client.login(token);
}
