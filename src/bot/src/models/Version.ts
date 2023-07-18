import { Schema, model, models } from "mongoose";

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

export default models?.Version || model("Version", Version);
