import { LensClient, development, production } from "@lens-protocol/client";
import {
  handleDomain,
  lensHubProxyAddress,
  useTestnet,
  alchemyApiKey,
  networkId,
} from "../constants";
import LensHubABI from "../abis/LensHubABI.json";
import { Contract, AlchemyProvider } from "ethers";

export const parseHandle = (input: string): string => {
  if (!input.endsWith(handleDomain) && input != "lensprotocol") {
    return input + handleDomain;
  }
  return input;
};

export const getProfileId = async (handle: string) => {
  // TODO: Use Lens SDK for getProfileId when fixed
  const provider = new AlchemyProvider(networkId, alchemyApiKey);
  const lensHubContract = new Contract(
    lensHubProxyAddress,
    LensHubABI,
    provider
  );

  return await lensHubContract.getProfileIdByHandle(handle);
};

export const getProfileUrl = (handle: string) =>
  `https://lensfrens.xyz/${handle}`;

export const getProfileByHandle = async (handle: string) => {
  const lensClient = new LensClient({
    environment: useTestnet ? development : production,
  });

  const profile = await lensClient.profile.fetch({ handle });
  return profile;
};
