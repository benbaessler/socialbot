import { getProfileUrl, parseHandle } from ".";

export const helpEmbedContent = `Lens Echo allows you to receive real-time updates from any Lens profile in your Discord server. **Here is a summary of the commands**:

• \`/follow\` - Add a Lens profile to be monitored in your server.
• \`/unfollow\` - Remove a Lens profile from the feed.
• \`/edit\` - Edit the preferences of a Lens profile monitor.
• \`/list\` - See all profiles being monitored in your server.

*Built with :heart: by [Ben Baessler](https://lensfrens.xyz/benbaessler.lens)*`;

export const listEmbedContent = (monitors: any[]) => {
  if (monitors.length === 0) {
    return "No profiles are being monitored in this server. Use `/follow` to add a profile to the feed.";
  }

  const groupedMonitors = monitors.reduce((acc: any, monitor: any) => {
    const { handle } = monitor;
    if (!acc[handle]) {
      acc[handle] = [];
    }
    acc[handle].push(monitor);
    return acc;
  }, {});

  return Object.values(groupedMonitors)
    .map((group: any) => {
      const { handle, mention, includeMirrors, includeInteractions } = group[0];
      const channels = group
        .map((monitor: any) => `<#${monitor.channelId}>`)
        .join(" ");

      return `**[@${parseHandle(handle)}](${getProfileUrl(handle)})**
Mentions: **${mention ? "Everyone" : "Off"}**
Mirrors: **${includeMirrors ? "Included" : "No"}**
Collects: **${includeInteractions ? "Included": "No"}**
Channel(s): ${channels}\n`;
    })
    .join("\n");
};
