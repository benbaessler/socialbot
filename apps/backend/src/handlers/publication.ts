import { AnyPublicationFragment } from "@lens-protocol/client";
import {
  MessageContent,
  PublicationEmbed,
  getPublicationUrl,
  getAvatar,
  hexToNumber,
} from "../utils";
import { sendToDiscord } from ".";
import { EmbedBuilder } from "discord.js";

export const handlePublication = async (
  publication: AnyPublicationFragment
) => {
  const profile = publication.by;
  const publicationUrl = getPublicationUrl(publication.id);

  const type = publication.__typename!;

  let embeds: EmbedBuilder[];
  if (publication.__typename == "Mirror") {
    embeds = PublicationEmbed(publication.mirrorOn);
  } else if (publication.__typename == "Comment") {
    embeds = [
      ...PublicationEmbed(publication.commentOn, false),
      ...PublicationEmbed(publication),
    ];
  } else if (publication.__typename == "Quote") {
    embeds = [
      ...PublicationEmbed(publication),
      ...PublicationEmbed(publication.quoteOn, false),
    ];
  } else {
    embeds = PublicationEmbed(publication);
  }

  let content = MessageContent(type, publicationUrl);

  const payload = {
    username:
      profile.metadata?.displayName ?? profile.handle?.fullHandle ?? profile.id,
    avatar_url: getAvatar(profile),
    content,
    embeds,
  };

  await sendToDiscord({
    profileId: hexToNumber(profile.id),
    type,
    payload,
  });
};
