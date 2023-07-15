import { Log } from "ethers";
import express, { Request, Response } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { topics, dbConnectionString } from "./constants";
import {
  handlePublication,
  handleMirror,
  handleCollect,
  startListener,
} from "./handlers";
import { init } from "@sentry/node";
require("dotenv").config();

const app = express();

const authenticateRequest = (
  request: Request,
  response: Response,
  signingKey: string
) => {
  const signature = request.headers["x-tenderly-signature"] as string;
  const timestamp = request.headers["date"] as string;

  if (!isValidSignature(signingKey, signature, request.body, timestamp)) {
    response.status(400).send("Webhook signature not valid");
    return;
  }

  let body;
  try {
    body = JSON.parse(request.body.toString());
  } catch (e) {
    response.status(400).send("Webhook error: " + e);
    return;
  }

  return body;
};

app.post(
  "/new-post",
  express.raw({ type: "application/json" }),
  async (request: Request, response: Response) => {
    const body = authenticateRequest(
      request,
      response,
      process.env.POST_SIGNING_KEY!
    );

    await handlePublication(
      "Post",
      body.transaction.logs.find((log: Log) => log.topics[0] == topics.post),
      body.transaction.hash
    );

    // Return a 200 response
    response.send();
  }
);

app.get("/new-post", (request: Request, response: Response) => {
  response.send("Health check OK");
});

app.post(
  "/new-comment",
  express.raw({ type: "application/json" }),
  async (request: Request, response: Response) => {
    const body = authenticateRequest(
      request,
      response,
      process.env.COMMENT_SIGNING_KEY!
    );

    await handlePublication(
      "Comment",
      body.transaction.logs.find((log: Log) => log.topics[0] == topics.comment),
      body.transaction.hash
    );

    // Return a 200 response
    response.send();
  }
);

app.get("/new-comment", (request: Request, response: Response) => {
  response.send("Health check OK");
});

app.post(
  "/new-mirror",
  express.raw({ type: "application/json" }),
  async (request: Request, response: Response) => {
    const body = authenticateRequest(
      request,
      response,
      process.env.MIRROR_SIGNING_KEY!
    );

    await handleMirror(
      body.transaction.logs.find((log: Log) => log.topics[0] == topics.mirror),
      body.transaction.hash
    );

    // Return a 200 response
    response.send();
  }
);

app.get("/new-mirror", (request: Request, response: Response) => {
  response.send("Health check OK");
});

app.post(
  "/new-collect",
  express.raw({ type: "application/json" }),
  async (request: Request, response: Response) => {
    const body = authenticateRequest(
      request,
      response,
      process.env.COLLECT_SIGNING_KEY!
    );

    await handleCollect(
      body.transaction.logs.find((log: Log) => log.topics[0] == topics.collect),
      body.transaction.logs.filter(
        (log: any) => log.topics[0] == topics.transfer
      ),
      body.transaction.hash
    );

    // Return a 200 response
    response.send();
  }
);

app.get("/new-collect", (request: Request, response: Response) => {
  response.send("Health check OK");
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  init({ dsn: process.env.SENTRY_DSN });
  await mongoose.connect(dbConnectionString!);
  console.log("Connected to Database");
  console.log("Running on port ", port);
  startListener();
});

function isValidSignature(
  signingKey: string,
  signature: string,
  body: string,
  timestamp: string
) {
  const hmac = crypto.createHmac("sha256", signingKey); // Create a HMAC SHA256 hash using the signing key
  hmac.update(body.toString(), "utf8"); // Update the hash with the request body using utf8
  hmac.update(timestamp); // Update the hash with the request timestamp
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
