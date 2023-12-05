require("dotenv").config({ path: "../../.env" });

export const useMainnet: boolean = process.env.USE_MAINNET == "true";

export const SIGNING_KEY = process.env.SIGNING_KEY!;

export const SENTRY_DSN = process.env.SENTRY_DSN!;

export const graphEndpoint = useMainnet
  ? "wss://api-v2.lens.dev"
  : "wss://api-v2-mumbai-live.lens.dev";

export const appIcons: { [key: string]: string } = {
  hey: "https://hey.xyz/logo.png",
  orb: "https://assets-global.website-files.com/6364e65656ab107e465325d2/637adce0f72214c270ffa76e_JQtTVb7vwFnUVbc9IshTcAUewaoeO8Up_B6pqkeRFGA.jpeg",
  phaver:
    "https://play-lh.googleusercontent.com/zvGNd9l1io5wL0SVxzqIrMzA0bRoO8Dsxmam8rj_KYZSi7hxg8L7VS-_HO2HxM3k9ak",
  tape: "https://pbs.twimg.com/profile_images/1710240896611135488/720GQtzb_400x400.jpg",
  buttrfly: "https://buttrfly.app/buttrfly-icon-rounded.png",
  chainjet:
    "https://pbs.twimg.com/profile_images/1567155757761679361/k_EIJBD5_400x400.jpg",
  unknown: "https://i.imgur.com/GGXvzmz.png",
};

export const dbConnectionString = useMainnet
  ? process.env.DB_CONN_STRING!
  : process.env.DB_CONN_STRING_TEST!;

export const ipfsGateway = "https://cf-ipfs.com/ipfs/";
export const arweaveGateway = "https://arweave.net/";

export const lensMediaSnapshotUrl =
  "https://ik.imagekit.io/lens/media-snapshot";
