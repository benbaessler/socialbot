import start from "./bot";
import deployCommands from "./deploy-commands";
import { init } from "@sentry/node";
import { useTestnet } from "./constants";

const main = async () => {
  if (!useTestnet) {
    init({ dsn: process.env.SENTRY_DSN });
  }
  await deployCommands();
  await start();

  console.log("Bot started");
};

main();
