import { CommentFragment, PostFragment } from "@lens-protocol/client";
import {
  MessageContent,
  PublicationEmbed,
  getMonitoredProfileIds,
  lensHubInterface,
  getPublicationUrl,
  getPictureUrl,
  getProfile,
  numberToHex,
  parseUri,
  getPublicationById,
  getProfileUrl,
} from "../utils";
import { ILog } from "../types";
import { sendToDiscord } from "./send";
import { Log } from "ethers";

export const handlePublication = async (
  type: "Post" | "Comment",
  log: Log,
  txHash: string
) => {
  const decoded = lensHubInterface.parseLog(log as unknown as ILog);
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

    if (!profile || !metadata) {
      return new Error(
        `Failed to fetch data; profileId: ${profileId}; tx: ${txHash}`
      );
    }

    const publicationId = `${profile.id}-${numberToHex(pubId)}`;

    let targetHandle: string | undefined = undefined;
    if (type == "Comment") {
      const pub = (await getPublicationById(pubId)) as CommentFragment;
      targetHandle = pub.commentOn?.profile.handle;
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
      } else {
        return new Error(
          `Quoted publication not found (tx: ${txHash}; id: ${pubId}; quotedId: ${quotedPost.value})`
        );
      }
    }

    const payload = {
      username: profile.name ?? profile.handle,
      avatar_url: getPictureUrl(profile),
      content,
      embeds,
    };

    await sendToDiscord({
      profileId: profileId.toString(),
      type,
      payload,
    });
  } catch (error) {
    return new Error(
      `Error handling publication (tx: ${txHash}; id: ${pubId}): ${error}`
    );
  }
};
