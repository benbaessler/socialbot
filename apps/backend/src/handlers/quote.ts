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

export const handleQuote = async (log: Log, txHash: string) => {
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
      username:
        publication.by.metadata?.displayName ??
        publication.by.handle?.localName ??
        publication.by.id,
      avatar_url: getPictureUrl(publication.by),
      content: MessageContent("Mirrored", getPublicationUrl(publication.id)),
      embeds: PublicationEmbed({
        id: publication.id,
        metadata: publication.mirrorOn.metadata,
        profile: publication.mirrorOn.by,
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