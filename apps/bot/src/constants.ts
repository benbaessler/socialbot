require("dotenv").config();

export const colors = {
  main: 0x00501e,
  success: 0x0ec924,
  error: 0xff0000,
};

export const icons = {
  logo: "https://i.imgur.com/t2bjdAt.png",
  error: "https://i.imgur.com/gcKxdFO.png",
  success: "https://i.imgur.com/p8QxqB2.png",
};

export const useMainnet = process.env.USE_MAINNET == "true";

export const token = useMainnet
  ? process.env.DISCORD_BOT_TOKEN
  : process.env.DISCORD_BOT_TOKEN_TEST;

export const clientId = useMainnet
  ? process.env.DISCORD_CLIENT_ID
  : process.env.DISCORD_CLIENT_ID_TEST;

export const dbConnectionString = useMainnet
  ? process.env.DB_CONN_STRING
  : process.env.DB_CONN_STRING_TEST;
