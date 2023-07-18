import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  TextChannel,
} from "discord.js";
import { FollowEmbed, ErrorFollowEmbed } from "../utils";
import { parseHandle, getProfileByHandle, hexToNumber } from "@lens-echo/core";
import Instance from "../models/Instance";
import { captureException } from "@sentry/node";
import Stats from "../models/Stats";

const data = new SlashCommandBuilder()
  .setName("follow")
  .setDescription("Add a Lens profile to be monitored in your server.")
  .addStringOption((option) =>
    option
      .setName("handle")
      .setDescription("The Lens profile handle to add")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to send updates to")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("mirrors")
      .setDescription("Include mirrored posts?")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("collects")
      .setDescription("Include post collects?")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("mention")
      .setDescription("Mention @everyone on new posts?")
      .setRequired(true)
  );

const execute = async (interaction: ChatInputCommandInteraction) => {
  const handle = parseHandle(interaction.options.getString("handle")!);
  const channel = interaction.options.getChannel("channel")! as TextChannel;
  const includeMirrors = interaction.options.getBoolean("mirrors")!;
  const includeInteractions = interaction.options.getBoolean("collects")!;
  const mention = interaction.options.getBoolean("mention")!;
  const { guildId } = interaction;

  const profile = await getProfileByHandle(handle);
  if (!profile)
    return await interaction.reply({
      embeds: [ErrorFollowEmbed(handle, channel.id, "invalidHandle")],
      ephemeral: true,
    });

  // Check if profile is already being monitored
  const query = {
    channelId: channel.id,
    profileId: hexToNumber(profile.id),
    ownedBy: profile.ownedBy.toLowerCase(),
    guildId,
    handle,
  };
  if ((await Instance.countDocuments(query)) > 0)
    return await interaction.reply({
      embeds: [ErrorFollowEmbed(handle, channel.id, "alreadyMonitored")],
      ephemeral: true,
    });

  // Get existing webhook or create new webhook
  const channelInstance = await Instance.findOne({
    guildId,
    channelId: channel.id,
  });

  let webhookUrl;
  if (!channelInstance) {
    try {
      const webhook = await channel.createWebhook({
        name: "Lens Echo",
        avatar: "https://i.imgur.com/u03AmLH.png",
      });
      webhookUrl = webhook.url;
    } catch (error) {
      captureException(`Error creating webhook: ${error}`);
      return await interaction.reply({
        embeds: [ErrorFollowEmbed(handle, channel.id, "webhook")],
        ephemeral: true,
      });
    }
  } else {
    webhookUrl = channelInstance.webhookUrl;
  }

  const newInstance = new Instance({
    ...query,
    includeMirrors,
    includeInteractions,
    mention,
    webhookUrl,
  });
  await newInstance.save();

  Promise.all([
    interaction.reply({
      embeds: [FollowEmbed(handle, channel.id)],
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
