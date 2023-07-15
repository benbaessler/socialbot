import { LensClient, production, ProfileFragment } from "@lens-protocol/client";
import { Profile } from "../../../src/backend/src/generated";
import { parseUri } from ".";

export const lensClient = new LensClient({
  environment: production,
});

export const getProfile = async (profileId: string) =>
  await lensClient.profile.fetch({ profileId });

export const getProfileByHandle = async (handle: string) =>
  await lensClient.profile.fetch({ handle });

export const getPublicationbyTxHash = async (txHash: string) =>
  await lensClient.publication.fetch({ txHash });

export const getPublicationById = async (publicationId: string) =>
  await lensClient.publication.fetch({ publicationId });

export const getPictureUrl = (profile: ProfileFragment | Profile) => {
  const picture = profile.picture;
  return picture
    ? picture.__typename == "MediaSet"
      ? parseUri(picture.original.url)
      : // @ts-ignore
        parseUri(picture.uri)
    : "";
};

export const getDisplayName = (profile: ProfileFragment | Profile) =>
  profile.name ? `${profile.name} (@${profile.handle})` : `@${profile.handle}`;

export const getProfileUrl = (handle: string) =>
  `https://lensfrens.xyz/${handle}`;

export const getDefaultProfile = async (address: string) =>
  await lensClient.profile
    .fetchAll({ ownedBy: [address], limit: 1 })
    .then((res) => res.items[0]);
