import {
  getMonitoredProfileIds,
  getPublicationById,
  hexToNumber,
} from "../utils";
import { captureException } from "@sentry/node";
import { IMomokaTransaction } from "../types";
import { handlePublication } from ".";

export const handleMomokaTransaction = async (
  transaction: IMomokaTransaction
) => {
  const data = transaction.data.newMomokaTransaction;
  const publication = await getPublicationById(data.publication.id);

  if (!publication)
    return captureException(`Publication not found: ${data.publication.id}`);

  const monitoredProfileIds = await getMonitoredProfileIds();
  if (monitoredProfileIds.includes(hexToNumber(publication.by.id))) {
    try {
      await handlePublication(publication);
    } catch (error) {
      captureException(
        `Error with publication ${data.publication.id}: ${error}`
      );
    }
  }
};
