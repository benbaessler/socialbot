import { execute } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { WebSocket } from "ws";
import {
  getMonitoredHandles,
  MessageContent,
  PublicationEmbed,
  getPublicationUrl,
  getPictureUrl,
  getPublicationById,
  hexToNumber,
} from "../utils";
import { graphEndpoint, userAgent } from "../constants";
import { newTransactionQuery } from "../graphql/NewTransactionSubscription";
import { DataAvailabilityTransactionUnion } from "../generated";
import { captureException } from "@sentry/node";
import { sendToDiscord } from ".";
import {
  CommentFragment,
  MirrorFragment,
  PostFragment,
} from "@lens-protocol/client";

class CustomWebSocket extends WebSocket {
  constructor(address: string, protocols: string[]) {
    super(address, protocols, {
      headers: {
        "User-Agent": userAgent,
      },
    });
  }
}

export const startListener = () => {
  const link = new WebSocketLink({
    uri: graphEndpoint,
    options: {
      reconnect: true,
      connectionParams: {
        protocol: "graphql-ws",
      },
      connectionCallback: (error: Error[]) => {
        if (error) console.error(error);
      },
    },
    webSocketImpl: CustomWebSocket,
  });

  const subClient = execute(link, { query: newTransactionQuery });

  subClient.subscribe((eventData) =>
    handleDAPublication(eventData.data?.newDataAvailabilityTransaction)
  );
};

export const handleDAPublication = async (
  data: DataAvailabilityTransactionUnion
) => {
  const monitoredHandles = await getMonitoredHandles();
  if (!data || !monitoredHandles.includes(data.profile.handle)) return;

  const publication = await getPublicationById(data.publicationId);

  if (!publication) {
    return new Error(`Publication not found: ${data.publicationId}`);
  }

  const profile = publication.profile;
  const post =
    publication.__typename == "Mirror" ? publication.mirrorOf : publication;
  const type = publication.__typename;
  const publicationUrl = getPublicationUrl(post.id);
  const targetHandle =
    type == "Comment"
      ? (post as CommentFragment).commentOn!.profile.handle
      : undefined;

  let content = MessageContent(type + "ed", publicationUrl, targetHandle);
  const embeds = PublicationEmbed({
    id: post.id,
    appId: data.appId,
    metadata: post.metadata,
    profile:
      type == "Mirror"
        ? (publication as MirrorFragment).mirrorOf.profile
        : profile,
  });

  const quotedPost = post.metadata.attributes.find(
    // @ts-ignore
    (attribute) => attribute.traitType == "quotedPublicationId"
  );

  if (quotedPost) {
    let quotedPub = (await getPublicationById(
      quotedPost.value!
    )) as PostFragment | null;

    if (quotedPub) {
      const quotedHandle = quotedPub.profile.handle;
      content = MessageContent("Quoted", publicationUrl, quotedHandle);
      embeds.push(
        ...PublicationEmbed({
          id: quotedPub.id,
          metadata: quotedPub.metadata,
          profile: quotedPub.profile,
        })
      );
    } else
      throw new Error(
        `Quoted publication not found (id: ${publication.id}; quotedId: ${quotedPost.value})`
      );
  }

  const payload = {
    username: profile.name ?? profile.handle,
    avatar_url: getPictureUrl(profile),
    content,
    embeds,
  };

  await sendToDiscord({
    profileId: hexToNumber(profile.id),
    type,
    payload,
  });
};
