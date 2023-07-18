import { Schema, model, models } from "mongoose";
import { IStats } from "@lens-echo/core/src/types";

const Stats = new Schema<IStats>({
  guildId: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  postsPosted: {
    type: Number,
    required: true,
    default: 0,
  },
  commentsPosted: {
    type: Number,
    required: true,
    default: 0,
  },
  mirrorsPosted: {
    type: Number,
    required: true,
    default: 0,
  },
  collectsPosted: {
    type: Number,
    required: true,
    default: 0,
  },
  commandsUsed: {
    type: Number,
    required: true,
    default: 0,
  }
});

export default models?.Stats || model("Stats", Stats);