import axios from "axios";
import {
  getInstances,
  deleteInstances,
  getInstancesWithMirrors,
  getInstancesWithInteractions,
  increasePostedCount,
} from "../utils";
import { Payload } from "../utils";

interface Props {
  profileId: string;
  payload: Payload;
  type: "Post" | "Comment" | "Collect" | "Mirror";
}

export const sendToDiscord = async ({ profileId, payload, type }: Props) => {
  let instances: any[];
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

  const startTime = new Date().getTime();
  let sentAmount: number = 0;
  await Promise.all(
    instances.map(async (instance: any) => {
      const data = { ...payload };
      if (instance.mention) {
        data.content = `${data.content} @everyone`;
      }
      await Promise.all([
        axios.post(instance.webhookUrl, data),
        increasePostedCount(
          instance.guildId,
          `${type.toLowerCase()}sPosted`
        ),
        sentAmount++,
      ]).catch(() => {
        console.log(`Failed to send webhook to ${instance.webhookUrl}`);
        deleteInstances(instance.webhookUrl);
      });
    })
  );
  const timeInMs = new Date().getTime() - startTime;
  console.log(
    `Sent ${sentAmount} webhook(s) for ${profileId} in ${timeInMs}ms.`
  );
};
