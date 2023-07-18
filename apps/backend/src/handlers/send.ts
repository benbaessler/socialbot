import axios from "axios";
import {
  getInstances,
  deleteInstances,
  getInstancesWithMirrors,
  getInstancesWithInteractions,
  increasePostedCount,
  IInstance,
} from "../utils";
import { IPayload } from "../types";
import { captureException } from "@sentry/node";
interface Props {
  profileId: string;
  payload: IPayload;
  type: "Post" | "Comment" | "Collect" | "Mirror";
}

export const sendToDiscord = async ({ profileId, payload, type }: Props) => {
  let instances: IInstance[];
  switch (type) {
    case "Collect":
      instances = await getInstancesWithInteractions(profileId);
      break;
    case "Mirror":
      instances = await getInstancesWithMirrors(profileId);
      break;
    default:
      instances = await getInstances(profileId);
      break;
  }

  await Promise.all(
    instances.map(async (instance: IInstance) => {
      const data = { ...payload };
      if (instance.mention) {
        data.content = `${data.content} @everyone`;
      }
      await Promise.all([
        axios.post(instance.webhookUrl, data),
        increasePostedCount(instance.guildId, `${type.toLowerCase()}sPosted`),
      ]).catch(() => {
        captureException(`Failed to send webhook to ${instance.webhookUrl}`);
        deleteInstances(instance.webhookUrl);
      });
    })
  );
};
