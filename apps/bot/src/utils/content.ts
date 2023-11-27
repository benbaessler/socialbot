import { getProfileUrl, IInstance } from ".";

export const helpEmbedContent = `Social Bot allows you to receive real-time updates from any Lens profile in your Discord server. **Here is a summary of available commands**:

• \`/follow\` - Add a Lens profile to be monitored in your server.
• \`/unfollow\` - Remove a Lens profile from the feed.
• \`/edit\` - Edit the preferences of a Lens profile monitor.
• \`/list\` - See all profiles being monitored in your server.`;

export const listEmbedContent = (monitors: IInstance[]) => {
  if (monitors.length === 0) {
    return "No profiles are being monitored in this server. Use `/follow` to add a profile to the feed.";
  }

  const groupedMonitors = monitors.reduce((acc: any, monitor: IInstance) => {
    const { handle } = monitor;
    if (!acc[handle]) {
      acc[handle] = [];
    }
    acc[handle].push(monitor);
    return acc;
  }, {});

  return Object.values(groupedMonitors)
    .map((group: any) => {
      const {
        handle,
        mention,
        includeComments,
        includeMirrors,
        includeInteractions,
      } = group[0];
      const channels = group
        .map((monitor: IInstance) => `<#${monitor.channelId}>`)
        .join(" ");

      return `**@[${handle}](${getProfileUrl(handle)})**
Mentions: **${mention ? "Everyone" : "Off"}**
Comments: **${includeComments ? "Included" : "No"}**
Mirrors: **${includeMirrors ? "Included" : "No"}**
Collects: **${includeInteractions ? "Included" : "No"}**
Channel(s): ${channels}\n`;
    })
    .join("\n");
};
