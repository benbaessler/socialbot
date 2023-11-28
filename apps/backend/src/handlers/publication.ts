import { AnyPublicationFragment } from "@lens-protocol/client";
import {
  MessageContent,
  PublicationEmbed,
  getPublicationUrl,
  getPictureUrl,
  hexToNumber,
} from "../utils";
import { sendToDiscord } from ".";

export const handlePublication = async (
  publication: AnyPublicationFragment
) => {
  const profile = publication.by;
  const publicationUrl = getPublicationUrl(publication.id);

  const type = publication.__typename!;

  let posts;
  if (publication.__typename == "Mirror") {
    posts = [publication.mirrorOn];
  } else if (publication.__typename == "Comment") {
    posts = [publication.commentOn, publication];
  } else if (publication.__typename == "Quote") {
    posts = [publication, publication.quoteOn];
  } else {
    posts = [publication];
  }

  let content = MessageContent(type, publicationUrl);

  const embeds = posts.map((post) => PublicationEmbed(post)).flat();

  const payload = {
    username:
      profile.metadata?.displayName ?? profile.handle?.fullHandle ?? profile.id,
    avatar_url: getPictureUrl(profile),
    content,
    embeds,
  };


  await sendToDiscord({
    profileId: hexToNumber(profile.id),
    type,
    payload,
  });
};
