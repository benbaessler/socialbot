import start from "./bot";
import deployCommands from "./deploy-commands";
import { init } from "@sentry/node";
import { useMainnet, SENTRY_DSN } from "./constants";

const main = async () => {
  if (useMainnet) init({ dsn: SENTRY_DSN });
  await deployCommands();
  await start();

  console.log("Bot is running...");
};

main();
