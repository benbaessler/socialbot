import { Schema, model, models } from "mongoose";

const VersionManager = new Schema({
  version: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default models?.VersionManager || model("VersionManager", VersionManager);
