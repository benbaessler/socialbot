import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import {
  EditEmbed,
  ProfileErrorEmbed,
  ErrorEmbed,
  parseHandle
} from "../utils";
import Instance from "../models/Instance";
import Stats from "../models/Stats";

const data = new SlashCommandBuilder()
  .setName("edit")
  .setDescription("Modify a monitor's options.")
  .addStringOption((option) =>
    option
      .setName("handle")
      .setDescription("The Lens profile handle to edit")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel in which the profile is being monitored")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("comments")
      .setDescription("Include comments?")
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
  const includeComments = interaction.options.getBoolean("comments")!;
  const includeMirrors = interaction.options.getBoolean("mirrors")!;
  const includeInteractions = interaction.options.getBoolean("collects")!;
  const mention = interaction.options.getBoolean("mention")!;

  const query = {
    guildId: interaction.guildId,
    channelId: channel.id,
    handle,
  };

  if (!(await Instance.findOne(query))) {
    return interaction.reply({
      embeds: [ProfileErrorEmbed(handle, channel.id)],
      ephemeral: true,
    });
  }

  const update = await Instance.updateOne(query, {
    includeComments,
    includeMirrors,
    includeInteractions,
    mention,
  });
  if (!update.acknowledged)
    return interaction.reply({
      embeds: [ErrorEmbed()],
      ephemeral: true,
    });

  await Promise.all([
    interaction.reply({
      embeds: [
        EditEmbed(
          handle,
          channel.id,
          includeComments,
          includeMirrors,
          includeInteractions,
          mention
        ),
      ],
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
