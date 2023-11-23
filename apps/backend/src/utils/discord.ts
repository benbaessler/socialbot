import { EmbedBuilder } from "discord.js";
import { ProfileFragment } from "@lens-protocol/client";
import {
  getPictureUrl,
  getDisplayName,
  getMediaUrl,
  getProfileUrl,
  capitalize,
} from ".";
import { appIcons } from "../constants";
import type { Profile, PublicationMetadata } from "../generated";
import { captureException } from "@sentry/node";

interface PublicationEmbedOptions {
  id: string;
  metadata: PublicationMetadata;
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
    .setColor(0x00501e)
    .setURL(embedUrl)
    .setAuthor({
      name: getDisplayName(profile),
      iconURL: getPictureUrl(profile),
      url: getProfileUrl(profile.handle?.fullHandle),
    });

  if (metadata.content) {
    let { content } = metadata;
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

  if ("attachments" in metadata) {
    const media = metadata.attachments;
    if (media && media.length > 0) {
      try {
        mainEmbed.setImage(getMediaUrl(media[0]));
      } catch (err) {
        captureException(`Error parsing media: ${err}`);
      }
      // @ts-ignore
      media.slice(1).forEach((item) => {
        try {
          embeds.push(
            new EmbedBuilder().setURL(embedUrl).setImage(getMediaUrl(item))
          );
        } catch (err) {
          captureException(`Error parsing media: ${err}`);
        }
      });
    }
  }
  return embeds;
};

export const MessageContent = (action: string, publicationUrl: string) => {
  const content = action == "Quote" ? "Quoted" : action + "ed";
  return `[${content}](${publicationUrl})`;
};

export const getPublicationUrl = (publicationId: string) =>
  `https://share.lens.xyz/p/${publicationId}`;
