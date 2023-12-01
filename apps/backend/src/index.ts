/// <reference path="./index.d.ts" />

import express, { Request, Response } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { WebSocket } from "ws";
import { createClient } from "graphql-ws";
import { newTransactionQuery } from "./graphql/NewTransactionSubscription";
import {
  SENTRY_DSN,
  dbConnectionString,
  graphEndpoint,
  SIGNING_KEY,
} from "./constants";
import { handlePublication, handleMomokaTransaction } from "./handlers";
import { captureException, init } from "@sentry/node";
import { IMomokaTransaction } from "./types";
import {
  getMonitoredProfileIds,
  getPublicationbyTxHash,
  hexToNumber,
} from "./utils";
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
  "/new-publication",
  express.raw({ type: "application/json" }),
  async (request: Request, response: Response) => {
    const body = authenticateRequest(
      request,
      response,
      SIGNING_KEY!
    );

    const publication = await getPublicationbyTxHash(body.transaction.hash);

    if (!publication)
      return captureException(
        `Publication not found: ${body.transaction.hash}`
      );

    const monitoredProfileIds = await getMonitoredProfileIds();

    if (monitoredProfileIds.includes(hexToNumber(publication.by.id))) {
      try {
        await handlePublication(publication);
      } catch (error) {
        captureException(`Error with ${body.transaction.hash}: ${error}`);
      }
    }

    response.send();
  }
);

app.get("/new-publication", (request: Request, response: Response) => {
  response.send("Health check OK");
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log("Running on port", port);
  init({ dsn: SENTRY_DSN });

  await mongoose.connect(dbConnectionString!);
  console.log("Connected to Database");

  const client = createClient({
    url: graphEndpoint,
    webSocketImpl: WebSocket,
  });

  client.subscribe(
    {
      query: newTransactionQuery,
    },
    {
      next: (data) => {
        handleMomokaTransaction(data as IMomokaTransaction);
      },
      error: (error) => captureException(error),
      // TODO: restart listener
      complete: () => {
        console.log("Momoka listener completed");
      },
    }
  );
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
