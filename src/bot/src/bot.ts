import { initializeEvents } from "./handlers/events";
import mongoose from "mongoose";
import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { token, useTestnet, dbConnectionString } from "./constants";
config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export default async function start() {
  await mongoose.connect(dbConnectionString!, { keepAlive: true });
  console.log("Connected to Database");

  await initializeEvents(client);

  console.log(`Running on ${useTestnet ? "testnet" : "mainnet"}`);
  client.login(token);
}
