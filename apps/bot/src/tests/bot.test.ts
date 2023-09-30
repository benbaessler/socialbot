import "jest";

// import { describe, expect, test } from "@jest/globals";
import { token, useMainnet } from "../constants";
import { client } from "../bot";
import dotenv from "dotenv";

dotenv.config({ path: "../../../.env" });

describe("Discord bot", () => {
  beforeAll(async () => {
    process.env.USE_MAINNET = "false";
    console.log(useMainnet);

    await client.login(token);
  });

  afterAll(async () => {
    await client.destroy();
  });

  it("should respond to /list and show the list of feeds", async () => {
    const message = {
      content: "/list",
      reply: jest.fn(),
    };

    client.emit("message", message);

    expect(message.reply).toHaveBeenCalledWith(
      expect.stringContaining("Monitored profiles in this server")
    );
  });
});
