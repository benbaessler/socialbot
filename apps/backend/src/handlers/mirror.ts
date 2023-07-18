import { MirrorFragment } from "@lens-protocol/client";
import {
  PublicationEmbed,
  MessageContent,
  getMonitoredProfileIds,
  lensHubInterface,
  getPublicationUrl,
  getPictureUrl,
  getPublicationbyTxHash,
} from "../utils";
import { ILog } from "../types";
import { sendToDiscord } from "./send";
import { Log } from "ethers";

export const handleMirror = async (log: Log, txHash: string) => {
  const decoded = lensHubInterface.parseLog(log as unknown as ILog);
  const monitoredProfileIds = await getMonitoredProfileIds();

  if (!decoded || !monitoredProfileIds.includes(decoded.args[0].toString()))
    return;

  const [profileId, publicationId] = decoded.args;
  try {
    const publication: MirrorFragment = (await getPublicationbyTxHash(
      txHash
    )) as MirrorFragment;

    if (!publication)
      return new Error(
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

    await sendToDiscord({
      profileId: profileId.toString(),
      type: "Mirror",
      payload,
    });
  } catch (err) {
    return new Error(
      `Error handling mirror publication (tx: ${txHash}; id: ${publicationId}): ${err}`
    );
  }
};
