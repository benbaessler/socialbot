import { EmbedBuilder } from "discord.js";
import {
  PrimaryPublicationFragment,
  CommentBaseFragment,
  QuoteBaseFragment,
} from "@lens-protocol/client";
import {
  getDisplayName,
  getAttachmentsData,
  getProfileUrl,
  capitalize,
  getAvatar,
} from ".";
import { appIcons } from "../constants";

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
        : `https://hey.xyz/profile/${post.by.id}`,
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
    getAttachmentsData(post.metadata.attachments).forEach(
      (item: any, index: number) => {
        if (index == 0) {
          mainEmbed.setImage(item.uri);
        } else {
          embeds.push(new EmbedBuilder().setURL(embedUrl).setImage(item.uri));
        }
      }
    );
  }

  return embeds;
};

export const MessageContent = (action: string, publicationUrl: string) => {
  const content = action == "Quote" ? "Quoted" : action + "ed";
  return `[${content}](${publicationUrl})`;
};

export const getPublicationUrl = (publicationId: string) =>
  `https://share.lens.xyz/p/${publicationId}`;
