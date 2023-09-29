import {
  LensClient,
  production,
  development,
  ProfileFragment,
} from "@lens-protocol/client";

export const useMainnet = process.env.USE_MAINNET == "true";

export const lensClient = new LensClient({
  environment: useMainnet ? production : development,
});

export const getProfileByHandle = async (
  handle: string
): Promise<ProfileFragment | null> =>
  await lensClient.profile.fetch({ handle });

export const getProfileUrl = (handle: string): string =>
  `https://lensfrens.xyz/${handle}`;

export const handleDomain = useMainnet ? ".lens" : ".test";

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

export const hexToNumber = (hex: string): string =>
  parseInt(hex, 16).toString();

export const parseHandle = (input: string): string => {
  if (!input.endsWith(handleDomain) && input != "lensprotocol") {
    return input + handleDomain;
  }
  return input;
};

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
