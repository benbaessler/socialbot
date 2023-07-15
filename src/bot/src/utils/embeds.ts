import { EmbedBuilder } from "discord.js";
import {
  getProfileUrl,
  listEmbedContent,
  helpEmbedContent,
  parseHandle,
} from ".";
import { colors, icons } from "../constants";
import Version from "../models/Version";

export const ListEmbed = (monitors: any[]) =>
  new EmbedBuilder()
    .setTitle(`Monitored profiles in this server (${monitors.length})`)
    .setDescription(listEmbedContent(monitors))
    .setColor(colors.main);

export const FollowEmbed = (handle: string, channelId: string) => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Profile added to feed!",
      iconURL: icons.success,
    })
    .setDescription(
      `**[@${handle}](${getProfileUrl(
        handle
      )})** will now be monitored for new publications in <#${channelId}>. You can stop monitoring this profile by running \`/unfollow\`.`
    )
    .setColor(colors.success);
};

export const ErrorFollowEmbed = (
  handle: string,
  channelId: string,
  error: string
) => {
  let content: { name: string; description: string };
  switch (error) {
    case "alreadyMonitored":
      content = {
        name: "Profile is already being monitored",
        description: `The handle you entered (**${handle}**) is already being monitored in <#${channelId}>.`,
      };
      break;
    case "invalidHandle":
      content = {
        name: "Invalid handle",
        description: `The handle you entered (**${handle}**) is not a valid Lens handle. Please try again.`,
      };
      break;
    case "webhook":
      content = {
        name: "Webhook error",
        description: `An error occurred while trying to create a webhook for <#${channelId}>. Please ensure that Lens Echo has permission to manage webhooks on this server.`,
      };
      break;
    default:
      content = {
        name: "Unknown error",
        description: `An unknown error occurred. Please try again.`,
      };
  }

  return new EmbedBuilder()
    .setAuthor({
      name: content.name,
      iconURL: icons.error,
    })
    .setDescription(content.description)
    .setColor(colors.error);
};

export const UnfollowEmbed = (handle: string, channelId: string) => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Profile removed from feed!",
      iconURL: icons.success,
    })
    .setDescription(
      `**[@${handle}](${getProfileUrl(
        handle
      )})** will no longer be monitored in <#${channelId}>.`
    )
    .setColor(colors.success);
};

export const EditEmbed = (
  handle: string,
  channelId: string,
  includeMirrors: boolean,
  includeInteractions: boolean,
  mention: boolean
) =>
  new EmbedBuilder().setAuthor({
    name: "Profile monitor updated!",
    iconURL: icons.success,
  }).setDescription(`**[@${handle}](${getProfileUrl(
    handle
  )})** will now be monitored in <#${channelId}> with the following settings:
Mentions: **${mention ? "Everyone" : "Off"}**
Mirrors: **${includeMirrors ? "Included" : "No"}**
Collects: **${includeInteractions ? "Included" : "No"}**`);

export const ProfileErrorEmbed = (handle: string, channelId: string) => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Invalid profile",
      iconURL: icons.error,
    })
    .setDescription(
      `The handle you entered (**${handle}**) is not being monitored in <#${channelId}>. Run \`/list\` to see all monitored profiles in your server.`
    )
    .setColor(colors.error);
};

export const ErrorEmbed = () => {
  return new EmbedBuilder()
    .setAuthor({
      name: "Something went wrong",
      iconURL: icons.error,
    })
    .setDescription(
      `An unknown error occurred. Please try again, or [contact us](mailto:hello@lensecho.xyz) for help.`
    )
    .setColor(colors.error);
};

export const HelpEmbed = async () => {
  const [version] = await Version.find({});
  return new EmbedBuilder()
    .setColor(colors.main)
    .setTitle("Quickstart :herb:")
    .setDescription(helpEmbedContent)
    .setFooter({
      text: `Lens Echo v${version.version}`,
      iconURL: icons.logo,
    });
};
