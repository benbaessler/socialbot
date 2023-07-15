import { Schema, model } from "mongoose";

const Version = new Schema({
  version: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default model("Version", Version);
