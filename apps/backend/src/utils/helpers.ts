import {
  arweaveGateway,
  defaultProfilePicture,
  ipfsGateway,
} from "../constants";
import {
  LensClient,
  ProfileFragment,
  AnyPublicationFragment,
  ProfilePictureSetFragment,
  NftImageFragment,
  development,
  production,
} from "@lens-protocol/client";

export interface IInstance {
  guildId: string;
  channelId: string;
  handle: string;
  profileId: string;
  ownedBy: string;
  includeComments: boolean;
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

export const getProfile = async (
  forProfileId: string
): Promise<ProfileFragment | null> =>
  await lensClient.profile.fetch({ forProfileId });

export const getPublicationbyTxHash = async (
  forTxHash: string
): Promise<AnyPublicationFragment | null> =>
  await lensClient.publication.fetch({ forTxHash });

export const getPublicationById = async (
  forId: string
): Promise<AnyPublicationFragment | null> =>
  await lensClient.publication.fetch({ forId });

export const getPictureUrl = (profile: ProfileFragment): string => {
  if (!profile.metadata?.picture) return defaultProfilePicture;
  const picture = profile.metadata.picture;
  let result: string;
  try {
    result = (picture as ProfilePictureSetFragment).raw.uri;
  } catch {
    result = (picture as NftImageFragment).image.raw.uri;
  }
  return parseUri(result);
};

export const getDisplayName = (profile: ProfileFragment): string =>
  profile.metadata?.displayName
    ? `${profile.metadata.displayName} (${
        profile.handle ? `@${profile.handle.fullHandle}` : profile.id
      })`
    : profile.handle
    ? `@${profile.handle.localName}`
    : profile.id;

export const getProfileUrl = (handle: string): string =>
  `https://share.lens.xyz/u/${handle}`;

export const getDefaultProfile = async (
  address: string
): Promise<ProfileFragment | null> =>
  await lensClient.profile.fetchDefault({ for: address });

export const parseUri = (uri: string): string => {
  if (uri.startsWith("ipfs")) {
    return `${ipfsGateway}${uri.slice(7)}`;
  }
  if (uri.startsWith("https://")) {
    return uri;
  }
  if (uri.startsWith("ar://")) {
    return `${arweaveGateway}${uri.slice(5)}`;
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

export const getMediaUrl = (media: any): string => {
  try {
    return parseUri(media.item);
  } catch {
    return parseUri(media.original.url);
  }
};
