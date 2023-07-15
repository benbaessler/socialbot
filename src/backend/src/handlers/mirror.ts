import { MirrorFragment } from "@lens-protocol/client";
import {
  PublicationEmbed,
  MessageContent,
  getMonitoredProfileIds,
  lensHubInterface,
  getPublicationUrl,
} from "../utils";
import { getPictureUrl, getPublicationbyTxHash } from "@lens-echo/core";
import { sendToDiscord } from "./send";
import { captureException } from "@sentry/node";

export const handleMirror = async (log: any, txHash: string) => {
  const decoded = lensHubInterface.parseLog(log);
  const monitoredProfileIds = await getMonitoredProfileIds();

  if (!decoded || !monitoredProfileIds.includes(decoded.args[0].toString()))
    return;

  const [profileId, publicationId] = decoded.args;
  try {
    const publication: MirrorFragment = (await getPublicationbyTxHash(
      txHash
    )) as MirrorFragment;

    if (!publication)
      return console.log(
        `Invalid publication id: ${publicationId}; Transaction: ${txHash}`
      );

    const payload = {
      username: publication.profile.name ?? publication.profile.handle,
      avatar_url: getPictureUrl(publication.profile as any),
      content: MessageContent("Mirrored", getPublicationUrl(publication.id)),
      embeds: PublicationEmbed({
        id: publication.id,
        metadata: publication.mirrorOf.metadata,
        profile: publication.mirrorOf.profile,
      }),
    };

    console.log(`Sending transaction: ${txHash}`);
    await sendToDiscord({
      profileId: profileId.toString(),
      type: "Mirror",
      payload,
    });
  } catch (err) {
    console.error(err);
    captureException(
      `Error handling mirror publication (tx: ${txHash}; id: ${publicationId}): ${err}`
    );
  }
};
