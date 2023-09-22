require("dotenv").config({ path: '../../.env' });

export const useMainnet: boolean = process.env.USE_MAINNET == "true";

export const POST_SIGNING_KEY = process.env.POST_SIGNING_KEY!;
export const COMMENT_SIGNING_KEY = process.env.COMMENT_SIGNING_KEY!;
export const MIRROR_SIGNING_KEY = process.env.MIRROR_SIGNING_KEY!;
export const COLLECT_SIGNING_KEY = process.env.COLLECT_SIGNING_KEY!;

export const SENTRY_DSN = process.env.SENTRY_DSN!;
export const PORT = process.env.PORT!;

export const interactionProxyAddress = useMainnet
  ? "0xcbea63064afbfab509c33f9843fd8e08336d5971"
  // TODO: Add testnet interaction proxy address
  : "";

export const topics = {
  post: "0xc672c38b4d26c3c978228e99164105280410b144af24dd3ed8e4f9d211d96a50",
  comment: "0x7b4d1aa33773161799847429e4fbf29f56dbf1a3fe815f5070231cbfba402c37",
  mirror: "0x9ea5dedb85bd9da4e264ee5a39b7ba0982e5d4d035d55edfa98a36b00e770b5a",
  collect: "0xed39bf0d9afa849610b901c9d7f4d00751ba20de2db023428065bec153833218",
  transfer:
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
};

export const graphEndpoint = useMainnet
  ? "wss://api.lens.dev"
  : "wss://api-mumbai.lens.dev";

export const appIcons: { [key: string]: string } = {
  lenster:
    "https://pbs.twimg.com/profile_images/1556882055379636224/4g4orntN_400x400.jpg",
  orb: "https://assets-global.website-files.com/6364e65656ab107e465325d2/637adce0f72214c270ffa76e_JQtTVb7vwFnUVbc9IshTcAUewaoeO8Up_B6pqkeRFGA.jpeg",
  phaver:
    "https://play-lh.googleusercontent.com/zvGNd9l1io5wL0SVxzqIrMzA0bRoO8Dsxmam8rj_KYZSi7hxg8L7VS-_HO2HxM3k9ak",
  lenstube:
    "https://img.lenstube.xyz/https://static.lenstube.xyz/images/brand/lenstube.svg",
  buttrfly: "https://buttrfly.app/buttrfly-icon-rounded.png",
  chainjet:
    "https://pbs.twimg.com/profile_images/1567155757761679361/k_EIJBD5_400x400.jpg",
  unknown: "https://i.imgur.com/F9OXqdZ.png",
};

export const dbConnectionString = useMainnet
  ? process.env.DB_CONN_STRING!
  : process.env.DB_CONN_STRING_TEST!;

export const ipfsGateway = "https://ipfs.io/ipfs/";
export const arweaveGateway = "https://arweave.net/";

export const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36";
