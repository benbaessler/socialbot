import { EmbedBuilder } from "discord.js";
import { ProfileFragment, MetadataFragment } from "@lens-protocol/client";
import {
  getPictureUrl,
  getDisplayName,
  getMediaUrl,
  getProfileUrl,
  capitalize,
} from ".";
import { appIcons } from "../constants";
import { Profile } from "../generated";
import { captureException } from "@sentry/node";

interface PublicationEmbedOptions {
  id: string;
  // TODO: Define metadata type
  metadata: any;
  profile: ProfileFragment | Profile;
  appId?: string;
}

export const PublicationEmbed = ({
  id,
  metadata,
  profile,
  appId,
}: PublicationEmbedOptions) => {
  const embedUrl = getPublicationUrl(id);

  const mainEmbed = new EmbedBuilder()
    .setTimestamp()
    .setColor(0x2b2d31)
    .setURL(embedUrl);

  try {
    mainEmbed.setAuthor({
      name: getDisplayName(profile),
      iconURL: getPictureUrl(profile),
      url: getProfileUrl(profile.handle),
    });
  } catch (err) {
    captureException(
      `Error parsing profile: ${err}; ${JSON.stringify(profile)}`
    );
  }

  let isGated = false;
  if (metadata.content) {
    let { content } = metadata;
    if (content == "This publication is gated") isGated = true;
    // Handle content length limit
    if (content.length > 4096) {
      content = content.substring(0, 4093) + "...";
    }
    mainEmbed.setDescription(content);
  }

  if (appId)
    mainEmbed.setFooter({
      text: `From ${capitalize(appId)}`,
      iconURL: appIcons[appId.toLowerCase()] ?? appIcons.unknown,
    });

  const embeds = [mainEmbed];
  if (!isGated) {
    const media = metadata.media;
    if (media && media.length > 0) {
      try {
        mainEmbed.setImage(getMediaUrl(media[0]));
        if (media.length > 1) {
          // @ts-ignore
          media.slice(1).forEach((item) => {
            embeds.push(
              new EmbedBuilder().setURL(embedUrl).setImage(getMediaUrl(item))
            );
          });
        }
      } catch (err) {
        captureException(`Error parsing media: ${err}`);
      }
    }
  }
  return embeds;
};

export const MessageContent = (
  action: string,
  publicationUrl: string,
  targetHandle?: string
) => {
  if (!targetHandle) {
    // Posted | Mirrored | Collected
    return `[${action}](${publicationUrl})`;
  } else if (action == "Commented") {
    return `[${action}](${publicationUrl}) on post by [@${targetHandle}](${getProfileUrl(
      targetHandle
    )})`;
  }
  // Quoted
  return `[${action}](${publicationUrl}) [@${targetHandle}](${getProfileUrl(
    targetHandle
  )})`;
};

export const getPublicationUrl = (publicationId: string) =>
  `https://share.lens.xyz/p/${publicationId}`;
