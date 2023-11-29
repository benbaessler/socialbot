import { EmbedBuilder } from "discord.js";
import {
  PrimaryPublicationFragment,
  CommentBaseFragment,
  QuoteBaseFragment,
} from "@lens-protocol/client";
import {
  getDisplayName,
  getAttachmentsData,
  getMediaUrl,
  getProfileUrl,
  capitalize,
  getAvatar,
} from ".";
import { appIcons } from "../constants";
import { captureException } from "@sentry/node";

export const PublicationEmbed = (
  post: PrimaryPublicationFragment | CommentBaseFragment | QuoteBaseFragment,
  includeFooter: boolean = true
) => {
  const embedUrl = getPublicationUrl(post.id);

  const mainEmbed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setURL(embedUrl)
    .setAuthor({
      name: getDisplayName(post.by),
      iconURL: getAvatar(post.by),
      url: post.by.handle
        ? getProfileUrl(post.by.handle.fullHandle)
        : // TODO: link to profile without handle
          "https://google.com",
    });

  if (post.metadata.__typename != "EventMetadataV3" && post.metadata.content) {
    let { content } = post.metadata;
    // Handle content length limit
    if (content.length > 4096) {
      content = content.substring(0, 4093) + "...";
    }
    mainEmbed.setDescription(content);
  }

  const appId = post.publishedOn?.id;

  if (includeFooter) {
    mainEmbed.setTimestamp();
    if (appId)
      mainEmbed.setFooter({
        text: `From ${capitalize(appId)}`,
        iconURL: appIcons[appId.toLowerCase()] ?? appIcons.unknown,
      });
  }

  const embeds = [mainEmbed];

  if ("attachments" in post.metadata) {
    const media = post.metadata.attachments;
    
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
