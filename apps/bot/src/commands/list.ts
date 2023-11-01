import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import Instance from "../models/Instance";
import { ListEmbed } from "../utils";
import { client } from "../bot";
import Stats from "../models/Stats";

const data = new SlashCommandBuilder()
  .setName("list")
  .setDescription("List all Lens profiles being monitored in your server.");

const execute = async (interaction: ChatInputCommandInteraction) => {
  const query = {
    guildId: interaction.guildId,
  };

  const monitors = await Instance.find(query);
  const channelIds = [...new Set(monitors.map((monitor) => monitor.channelId))];

  // Removing monitors with channels that no longer exist
  await Promise.all([
    ...channelIds.map((channelId) =>
      client.channels
        .fetch(channelId)
        .catch(() => Instance.deleteMany({ channelId }))
    ),
    interaction.reply({
      embeds: [await ListEmbed(monitors)],
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
