import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  TextChannel,
} from "discord.js";
import Instance from "../../../backend/src/models/Instance";
import { parseHandle, UnfollowEmbed, ProfileErrorEmbed } from "../utils";
import Stats from "../../../backend/src/models/Stats";

const data = new SlashCommandBuilder()
  .setName("unfollow")
  .setDescription("Stop monitoring a Lens profile's activity.")
  .addStringOption((option) =>
    option
      .setName("handle")
      .setDescription("The Lens profile handle to remove")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel in which the profile is being monitored")
      .setRequired(true)
  );

const execute = async (interaction: ChatInputCommandInteraction) => {
  const handle = parseHandle(interaction.options.getString("handle")!);
  const channel = interaction.options.getChannel("channel")! as TextChannel;

  const query = {
    guildId: interaction.guildId,
    channelId: channel.id,
    handle,
  };

  const removed = await Instance.deleteOne(query);
  if (!removed.acknowledged) {
    return interaction.reply({
      embeds: [ProfileErrorEmbed(handle, channel.id)],
      ephemeral: true,
    });
  }

  await Promise.all([
    interaction.reply({
      embeds: [UnfollowEmbed(handle, channel.id)],
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
