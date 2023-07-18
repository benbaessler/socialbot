import { CommentFragment, PostFragment } from "@lens-protocol/client";
import {
  lensHubInterface,
  isMonitoredAddress,
  PublicationEmbed,
  getPublicationUrl,
  MessageContent,
} from "../utils";
import { ILog } from "../types";
import {
  numberToHex,
  getPublicationById,
  getPictureUrl,
  getDefaultProfile,
  hexToNumber,
} from "@lens-echo/core";
import { Log } from "ethers";
import { interactionProxyAddress } from "../constants";
import { sendToDiscord } from "./send";

export const handleCollect = async (
  log: Log,
  transfers: Log[],
  txHash: string
) => {
  const decoded = lensHubInterface.parseLog(log as unknown as ILog);

  if (!decoded) return;

  const [, , , profileId, pubId] = decoded.args;

  let collector: string = "";
  transfers.forEach((log: Log) => {
    try {
      const transferEvent = lensHubInterface.parseLog(log as unknown as ILog);
      const receiver = transferEvent?.args[1].toLowerCase();
      if (receiver != interactionProxyAddress) collector = receiver;
    } catch (err) {}
  });

  if (!(await isMonitoredAddress(collector))) return;

  const profileIdHex = numberToHex(profileId);
  const publicationId = `${profileIdHex}-${numberToHex(pubId)}`;

  const [publication, profile] = await Promise.all([
    (await getPublicationById(publicationId)) as PostFragment | CommentFragment,
    getDefaultProfile(collector),
  ]);

  if (!publication || !profile)
    return new Error(`Failed to fetch data: ${txHash}`);

  const pubUrl = getPublicationUrl(publication.id);

  const payload = {
    username: profile.name ?? profile.handle,
    avatar_url: getPictureUrl(profile),
    content: MessageContent("Collected", pubUrl),
    embeds: PublicationEmbed({
      id: publication.id,
      metadata: publication.metadata,
      profile: publication.profile,
    }),
  };

  await sendToDiscord({
    profileId: hexToNumber(profile.id),
    type: "Collect",
    payload,
  });
};
