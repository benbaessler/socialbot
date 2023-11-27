import {
  getMonitoredProfileIds,
  MessageContent,
  PublicationEmbed,
  getPublicationUrl,
  getPictureUrl,
  getPublicationById,
  hexToNumber,
} from "../utils";
import { captureException } from "@sentry/node";
import { IMomokaTransaction } from "../types";
import { sendToDiscord } from ".";

export const handleMomokaTransaction = async (
  transaction: IMomokaTransaction
) => {
  const data = transaction.data.newMomokaTransaction;
  const publication = await getPublicationById(data.publication.id);

  if (!publication)
    return captureException(`Publication not found: ${data.publication.id}`);

  const monitoredProfileIds = await getMonitoredProfileIds();
  if (!publication || !monitoredProfileIds.includes(publication.by.id)) return;

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