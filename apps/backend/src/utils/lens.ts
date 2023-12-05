import urlcat from "urlcat";
import { sanitizeDStorageUrl } from "./sanitizeDStorageUrl";
import {
  LensClient,
  ProfileFragment,
  AnyPublicationFragment,
  development,
  production,
} from "@lens-protocol/client";
import { Maybe, PublicationMetadataMedia } from "../generated";

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

/**
 * Returns the avatar image URL for a given profile.
 *
 * @param profile The profile object.
 * @param namedTransform The named transform to use.
 * @returns The avatar image URL.
 */
export const getAvatar = (profile: any): string => {
  const avatarUrl =
    // Group Avatar fallbacks
    profile?.avatar ??
    // Lens NFT Avatar fallbacks
    profile?.metadata?.picture?.image?.optimized?.uri ??
    profile?.metadata?.picture?.image?.raw?.uri ??
    // Lens Profile Avatar fallbacks
    profile?.metadata?.picture?.optimized?.uri ??
    profile?.metadata?.picture?.raw?.uri ??
    // Stamp.fyi Avatar fallbacks
    getStampFyiURL(
      profile?.ownedBy.address ?? "0x0000000000000000000000000000000000000000"
    );

  return sanitizeDStorageUrl(avatarUrl);
};

/**
 * Returns the cdn.stamp.fyi URL for the specified Ethereum address.
 *
 * @param address The Ethereum address to get the URL for.
 * @returns The cdn.stamp.fyi URL.
 */
const getStampFyiURL = (address: string): string => {
  const lowerCaseAddress = address.toLowerCase();
  return urlcat("https://cdn.stamp.fyi/avatar/eth::address", {
    address: lowerCaseAddress,
    s: 300,
  });
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

export const getAttachmentsData = (
  attachments?: Maybe<PublicationMetadataMedia[]>
): any => {
  if (!attachments) {
    return [];
  }

  return attachments.map((attachment) => {
    switch (attachment.__typename) {
      case 'PublicationMetadataMediaImage':
        return {
          uri: attachment.image.optimized?.uri,
          type: 'Image'
        };
      case 'PublicationMetadataMediaVideo':
        return {
          uri: attachment.video.optimized?.uri,
          coverUri: attachment.cover?.optimized?.uri,
          type: 'Video'
        };
      case 'PublicationMetadataMediaAudio':
        return {
          uri: attachment.audio.optimized?.uri,
          coverUri: attachment.cover?.optimized?.uri,
          artist: attachment.artist,
          type: 'Audio'
        };
      default:
        return [];
    }
  });
};