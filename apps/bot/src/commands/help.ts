import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { HelpEmbed } from "../utils";
import Stats from "../models/Stats";

const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("View the Lens Echo Quickstart Guide.");

const execute = async (interaction: ChatInputCommandInteraction) => {
  await Promise.all([
    interaction.reply({
      embeds: [await HelpEmbed()],
      ephemeral: true,
    }),
    Stats.updateOne(
      { guildId: interaction.guildId },
      { $inc: { commandsUsed: 1 } }
    ),
  ]);
};

export default {
  data,
  execute,
};
