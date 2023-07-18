import {
  LensClient,
  production,
  development,
  ProfileFragment,
  PublicationFragment,
} from "@lens-protocol/client";
import { Profile } from "./generated";
import { parseUri, useMainnet } from ".";

export const lensClient = new LensClient({
  environment: useMainnet ? production : development,
});

export const getProfile = async (
  profileId: string
): Promise<ProfileFragment | null> =>
  await lensClient.profile.fetch({ profileId });

export const getProfileByHandle = async (
  handle: string
): Promise<ProfileFragment | null> =>
  await lensClient.profile.fetch({ handle });

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
