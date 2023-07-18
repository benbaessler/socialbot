<div align="center">
    <img src="https://i.imgur.com/l5NzmI1.png" alt="banner">
    <h1>Lens Echo</h1>
    <p>The first Web3 social interface on Discord.</p>
    <a href="https://lensecho.xyz">lensecho.xyz</a>
</div>

## About
Lens Echo is a Discord bot that can monitor Lens profiles in real time. Receive customizable notifications for **new posts, comments, mirrors, and collects**. Users can also manage their bot activities and view usage statistics via the [web dashboard](https://dashboard.lensecho.xyz).

## How does it work?

This monorepo consists of the following **workspaces**:

| Name    | Description|
| ------- | ---------------------------- |
| `apps/bot` | The Discord bot for handling commands.|
| `apps/backend` | Listening to GraphQL + on-chain events for Lens publications. |
| `packages/core` | A collection of helper functions/constants. |

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

## License

Lens Echo is an open-source software licensed under the [GNU-v3 License](https://github.com/benbaessler/lens-echo/blob/main/LICENSE).
