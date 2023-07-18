import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { token, clientId } from "./constants";
require("dotenv").config();

export default async function deployCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs.readdirSync(commandsPath);

  for (const file of commandFiles) {
    const module = await import(`./commands/${file}`);
    const command = module.default;
    commands.push(command.data.toJSON());
  }

  const rest = new REST().setToken(token!);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    await rest.put(Routes.applicationCommands(clientId!), {
      body: commands,
    });
  } catch (error) {
    throw new Error(`Error deploying commands: ${error}`);
  }
}
