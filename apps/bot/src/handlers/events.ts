import { Collection, Events, Guild } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import Instance from "../models/Instance";
import Stats from "../models/Stats";
import { captureException } from "@sentry/node";

// Used any type to initialize client.commands: https://discordjs.guide/creating-your-bot/command-handling.html#loading-command-files
export const initializeEvents = async (client: any) => {
  client.commands = new Collection();
  const commandsPath = join(__dirname, "..", "commands");
  const commandFiles = readdirSync(commandsPath);

  for (const file of commandFiles) {
    const module = await import(join(commandsPath, file));
    const command = module.default;

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${join(
          commandsPath,
          file
        )} is missing a required "data" or "execute" property.`
      );
    }
  }

  client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user!.tag}`);
  });

  client.on(Events.Error, (error: Error) => {
    captureException(error);
  });

  client.on(Events.Warn, (error: Error) => {
    captureException(error);
  });

  client.on(Events.GuildCreate, (guild: Guild) => {
    Stats.create({ guildId: guild.id, joinedAt: Date.now() });
  });

  client.on(Events.GuildDelete, async (guild: Guild) => {
    await Promise.all([
      Instance.deleteMany({ guildId: guild.id }),
      Stats.deleteOne({ guildId: guild.id }),
    ]);
  });

  // TODO: Add interaction type
  client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  });
};
