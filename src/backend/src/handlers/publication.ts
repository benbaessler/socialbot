import { CommentFragment, PostFragment } from "@lens-protocol/client";
import {
  MessageContent,
  PublicationEmbed,
  getMonitoredProfileIds,
  lensHubInterface,
  getPublicationUrl,
} from "../utils";
import {
  getPictureUrl,
  getProfile,
  numberToHex,
  parseUri,
  getPublicationById,
  getProfileUrl,
} from "@lens-echo/core";
import { sendToDiscord } from "./send";
import { captureException } from "@sentry/node";

export const handlePublication = async (
  type: "Post" | "Comment",
  log: any,
  txHash: string
) => {
  const decoded = lensHubInterface.parseLog(log);
  const monitoredProfileIds = await getMonitoredProfileIds();

  if (!decoded || !monitoredProfileIds.includes(decoded.args[0].toString()))
    return;

  const [profileId, pubId, contentUri] = decoded!.args;
  try {
    const parsedUri = parseUri(contentUri);

    const [profile, metadata] = await Promise.all([
      getProfile(numberToHex(profileId)),
      fetch(parsedUri).then((res) => res.json()),
    ]);

    const publicationId = `${profile!.id}-${numberToHex(pubId)}`;

    if (!profile)
      return console.log(
        `Invalid profile id: ${profileId}; Transaction: ${txHash}`
      );

    let targetHandle = undefined;
    if (type == "Comment") {
      const pub = (await getPublicationById(pubId)) as CommentFragment;
      targetHandle = pub.commentOn!.profile.handle;
    }

    let content = MessageContent(
      type + "ed",
      getPublicationUrl(publicationId),
      targetHandle
    );
    const embeds = PublicationEmbed({
      id: publicationId,
      metadata,
      profile,
      appId: metadata.appId,
    });

    const quotedPost = metadata.attributes.find(
      // @ts-ignore
      (attribute) => attribute.traitType == "quotedPublicationId"
    );

    if (quotedPost) {
      let quotedPub = (await getPublicationById(
        quotedPost.value
      )) as PostFragment | null;

      if (quotedPub) {
        const quotedHandle = quotedPub.profile.handle;
        content = `[Quoted](${getPublicationUrl(
          publicationId
        )}) [@${quotedHandle}](${getProfileUrl(quotedHandle)})`;
        embeds.push(
          ...PublicationEmbed({
            id: quotedPub.id,
            metadata: quotedPub.metadata,
            profile: quotedPub.profile,
          })
        );
      } else
        captureException(
          `Quoted publication not found (tx: ${txHash}; id: ${pubId}; quotedId: ${quotedPost.value})`
        );
    }

    const payload = {
      username: profile.name ?? profile.handle,
      avatar_url: getPictureUrl(profile),
      content,
      embeds,
    };

    console.log(`Sending transaction: ${txHash}`);
    await sendToDiscord({
      profileId: profileId.toString(),
      type,
      payload,
    });
  } catch (err) {
    console.error(err);
    captureException(
      `Error handling publication (tx: ${txHash}; id: ${pubId}): ${err}`
    );
  }
};
