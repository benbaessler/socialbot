import { Schema, model, models } from "mongoose";
import { IInstance } from "../utils";

const Instance = new Schema<IInstance>({
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  profileId: {
    type: String,
    required: true,
  },
  ownedBy: {
    type: String,
    required: true,
  },
  includeMirrors: {
    type: Boolean,
    required: true,
  },
  includeInteractions: {
    type: Boolean,
    required: true,
  },
  mention: {
    type: Boolean,
    required: true,
  },
  webhookUrl: {
    type: String,
    required: true,
  }
});

export default models?.Instance || model("Instance", Instance);