import {
  LensClient,
  MediaSetFragment,
  ProfileFragment,
  PublicationFragment,
  development,
  production,
} from "@lens-protocol/client";
import { Profile } from "../generated";
import Instance from "../models/Instance";

export interface IInstance {
  guildId: string;
  channelId: string;
  handle: string;
  profileId: string;
  ownedBy: string;
  includeMirrors: boolean;
  includeInteractions: boolean;
  mention: boolean;
  webhookUrl: string;
}

export interface IStats {
  guildId: string;
  joinedAt: Date;
  postsPosted: number;
  commentsPosted: number;
  mirrorsPosted: number;
  collectsPosted: number;
  commandsUsed: number;
}

export const useMainnet = process.env.USE_MAINNET == "true";
export const handleDomain = useMainnet ? ".lens" : ".test";

export const lensClient = new LensClient({
  environment: useMainnet ? production : development,
});

// Run at initialization to account for profile transfers.
export const updateOwnedBy = async () => {
  console.log("Running updateOwnedBy");
  const instances = await Instance.find({});
  const handles = [...new Set(instances.map((instance) => instance.handle))];

  const profiles = await lensClient.profile.fetchAll({ handles });

  // Update ownedBy field for each instance.
  for (const instance of instances) {
    const profile = profiles.items.find(
      (profile) => profile.handle == instance.handle
    );
    if (profile) {
      if (profile.ownedBy !== instance.ownedBy) {
        console.log(
          `Updated ownedBy for ${instance.handle} from ${profile.ownedBy} to ${instance.ownedBy}`
        );
      }

      instance.ownedBy = profile.ownedBy;
      await instance.save();
    }
  }

  console.log("Finished updateOwnedBy");
};

export const getProfile = async (
  profileId: string
): Promise<ProfileFragment | null> =>
  await lensClient.profile.fetch({ profileId });

export const getPublicationbyTxHash = async (
  txHash: string
): Promise<PublicationFragment | null> =>
  await lensClient.publication.fetch({ txHash });

export const getPublicationById = async (
  publicationId: string
): Promise<PublicationFragment | null> =>
  await lensClient.publication.fetch({ publicationId });

export const getPictureUrl = (profile: ProfileFragment | Profile): string => {
  const picture = profile.picture;
  return picture
    ? picture.__typename == "MediaSet"
      ? parseUri(picture.original.url)
      : // @ts-ignore
        parseUri(picture.uri)
    : "";
};

export const getDisplayName = (profile: ProfileFragment | Profile): string =>
  profile.name ? `${profile.name} (@${profile.handle})` : `@${profile.handle}`;

export const getProfileUrl = (handle: string): string =>
  `https://lensfrens.xyz/${handle}`;

export const getDefaultProfile = async (
  address: string
): Promise<ProfileFragment> =>
  await lensClient.profile
    .fetchAll({ ownedBy: [address], limit: 1 })
    .then((res) => res.items[0]);

export const parseUri = (uri: string): string => {
  if (uri.startsWith("ipfs")) {
    return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  }
  if (uri.startsWith("https://")) {
    return uri;
  }
  if (uri.startsWith("ar://")) {
    return `https://arweave.net/${uri.slice(5)}`;
  }
  console.log(`Invalid URI ${uri}`);
  return "";
};

export const numberToHex = (num: number): string => {
  let hexValue = num.toString(16);

  // Ensure an even number of digits
  if (hexValue.length % 2 !== 0) {
    hexValue = "0" + hexValue;
  }

  return `0x${hexValue}`;
};

export const hexToNumber = (hex: string): string =>
  parseInt(hex, 16).toString();

export const capitalize = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

export const getMediaUrl = (media: MediaSetFragment): string => {
  const item = media as any;
  try {
    return parseUri(item.item);
  } catch {
    return parseUri(media.original.url);
  }
};
