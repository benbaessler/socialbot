<div align="center">
    <img src="https://i.imgur.com/ulIxJV8.png" alt="banner">
    <h1>Social Bot</h1>
    <p>All-In-One Web3 social interface on Discord.</p>
    <a href="https://socialbot.gg">socialbot.gg</a>
</div>

## About
Social Bot is a Discord bot that can monitor Lens profiles in real time. Receive customizable notifications for **new posts, comments, mirrors, and collects**. Users can also manage their bot activities and view usage statistics via the [web dashboard](https://dashboard.socialbot.gg).

## How does it work?

This monorepo consists of the following **workspaces**:

| Name    | Description|
| ------- | ---------------------------- |
| `apps/bot` | The Discord bot for handling commands.|
| `apps/backend` | Listening to GraphQL + on-chain events for Lens publications. |

[MongoDB](https://www.mongodb.com/) is used to store information about feeds, statistics, and version control.<br/>

The backend uses GraphQL subscriptions to listen to incoming [data availability](https://docs.lens.xyz/docs/data-availability-post) publications on Lens. It also receives [Tenderly](https://tenderly.co/) alert webhooks (*express.js*) for new publications from the [LensHub contract](https://docs.lens.xyz/docs/deployed-contract-addresses).

## Getting Started

Install all dependencies from repository root:

```bash
yarn install
```

Start the applications with:

```bash
yarn dev:bot
```
```bash
yarn dev:backend
```

## Contribute
Any contributors are highly appreciated. Feel free to contribute to this project but please read the [Contributing Guidelines](https://github.com/benbaessler/socialbot/blob/main/CONTRIBUTING.md) before opening an issue or PR so you understand the branching strategy and local development environment.

## Contact
Twitter: [@socialbotgg](https://twitter.com/socialbotgg)<br/>
Lens: [@socialbot](https://share.lens.xyz/u/lensecho.lens)<br/>

## License
Social Bot is an open-source software licensed under the [GPL-v3 License](https://github.com/benbaessler/socialbot/blob/main/LICENSE).
