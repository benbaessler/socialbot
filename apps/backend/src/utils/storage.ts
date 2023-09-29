import Instance from "../models/Instance";
import Stats from "../models/Stats";

export const getMonitoredProfileIds = async () => {
  const instances = await Instance.find({});
  const profileIds = instances.map((instance) => instance.profileId);
  return [...new Set(profileIds)];
};

export const getMonitoredHandles = async () => {
  const instances = await Instance.find({});
  const handles = instances.map((instance) => instance.handle);
  return [...new Set(handles)];
};

export const isMonitoredAddress = async (address: string) => {
  const instances = await Instance.find({ ownedBy: address });
  return instances.length > 0;
};

export const getInstances = async (profileId: string) =>
  await Instance.find({ profileId });

export const getInstancesWithComments = async (profileId: string) =>
  await Instance.find({
    profileId,
    includeComments: true,
  });

export const getInstancesWithMirrors = async (profileId: string) =>
  await Instance.find({
    profileId,
    includeMirrors: true,
  });

export const getInstancesWithInteractions = async (profileId: string) =>
  await Instance.find({
    profileId,
    includeInteractions: true,
  });

export const deleteInstances = async (webhookUrl: string) =>
  await Instance.deleteMany({ webhookUrl });

export const increasePostedCount = async (guildId: string, type: string) => {
  await Stats.findOneAndUpdate(
    { guildId },
    { $inc: { [type]: 1 } },
    { upsert: true }
  );
};
