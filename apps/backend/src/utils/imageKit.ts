import { lensMediaSnapshotUrl } from "../constants";

/**
 * Transforms the URL of an image to use ImageKit.
 *
 * @param url The original URL of the image.
 * @param name The transformation name (optional).
 * @returns A transformed URL.
 */
export const imageKit = (url: string, name?: string): string => {
  if (!url) {
    return "";
  }

  if (url.includes(lensMediaSnapshotUrl)) {
    const splitedUrl = url.split("/");
    const path = splitedUrl[splitedUrl.length - 1];

    return name ? `${lensMediaSnapshotUrl}/${name}/${path}` : url;
  }

  return url;
};
