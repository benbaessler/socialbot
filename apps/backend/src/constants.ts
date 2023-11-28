require("dotenv").config({ path: "../../.env" });

export const useMainnet: boolean = process.env.USE_MAINNET == "true";

export const SIGNING_KEY = process.env.SIGNING_KEY!;

export const SENTRY_DSN = process.env.SENTRY_DSN!;

export const interactionProxyAddress = useMainnet
  ? "0xcbea63064afbfab509c33f9843fd8e08336d5971"
  : // TODO: Add testnet interaction proxy address
    "";

export const topics = {
  post: "0xe18912378f90aa372fc9ab7ab5ff7e4744182bdef133ccad56d5a18864456742",
  comment: "0x6730c5edd594025e9d1057522801addabbb26fe8ec0acb70a658002f75684388",
  mirror: "0x19822529a03d77bbe525763dd7064f5c182a5ede1bdd88e73a07221d3f3feb6d",
  act: "0x61f8aa74c55cf20b1d5e4f2f6531f66747a0bbbc7696cbb2844738feb8300aad",
  collect: "0x4b220a4de1946418b442a3659c114b9f74ed61e23509c34f97bbe8f2f1d645e0",
  transfer:
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  // not used currently
  follow: "0x817d2c71a3ec35dc50f2e4b0d890943c89f2a7ab9d96eff233eda4932b506d0b",
};

export const graphEndpoint = useMainnet
  ? "wss://api-v2.lens.dev"
  : "wss://api-v2-mumbai-live.lens.dev";

export const appIcons: { [key: string]: string } = {
  hey: "https://hey.xyz/logo.png",
  orb: "https://assets-global.website-files.com/6364e65656ab107e465325d2/637adce0f72214c270ffa76e_JQtTVb7vwFnUVbc9IshTcAUewaoeO8Up_B6pqkeRFGA.jpeg",
  phaver:
    "https://play-lh.googleusercontent.com/zvGNd9l1io5wL0SVxzqIrMzA0bRoO8Dsxmam8rj_KYZSi7hxg8L7VS-_HO2HxM3k9ak",
  tape: "https://static.tape.xyz/brand/logo.svg",
  buttrfly: "https://buttrfly.app/buttrfly-icon-rounded.png",
  chainjet:
    "https://pbs.twimg.com/profile_images/1567155757761679361/k_EIJBD5_400x400.jpg",
  unknown: "https://i.imgur.com/GGXvzmz.png",
};

export const defaultProfilePicture =
  "https://raw.githubusercontent.com/lens-protocol/brand-kit/074e865b5da4b2b80133915b15e82f9ba1f02881/01%20Logo/SVG/Icon-Green.svg";

export const dbConnectionString = useMainnet
  ? process.env.DB_CONN_STRING!
  : process.env.DB_CONN_STRING_TEST!;

export const ipfsGateway = "https://cf-ipfs.com/ipfs/";
export const arweaveGateway = "https://arweave.net/";

export const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36";
