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

export const useTestnet = process.env.USE_TESTNET == "true";
export const networkId = useTestnet ? 80001 : 137;
export const handleDomain = useTestnet ? ".test" : ".lens";

export const lensHubProxyAddress = useTestnet
  ? "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"
  : "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export const alchemyApiKey = useTestnet
  ? process.env.ALCHEMY_API_KEY_TEST
  : process.env.ALCHEMY_API_KEY;

export const collectionName = useTestnet ? "test" : "production";

export const token = useTestnet
  ? process.env.DISCORD_BOT_TOKEN_TEST
  : process.env.DISCORD_BOT_TOKEN;

export const clientId = useTestnet
  ? process.env.DISCORD_CLIENT_ID_TEST
  : process.env.DISCORD_CLIENT_ID;

export const dbConnectionString = useTestnet
  ? process.env.DB_CONN_STRING_TEST
  : process.env.DB_CONN_STRING;
