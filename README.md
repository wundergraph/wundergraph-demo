# WunderGraph Demo with Apollo Federation & Subscriptions

This repository demonstrates how to combine multiple APIs into one unified API
and exposing it as a secure JSON API without losing on developer experience.

We're combining the following services:
- 4 Apollo GraphQL SubGraphs (Accounts, Inventory, Products, Reviews) combined as a SuperGraph
- 1 REST API (JSON Placeholder)
- 1 standalone GraphQL API (Trevorblades Countries GraphQL API)
- 1 Mock REST API

![Architecture Overview](ArchitectureOverview.png "Architecture Overview")

All 7 APIs are combined into one unified GraphQL API and securely exposed using JSON RPC.

This example shows how to use Apollo Federation with Subscriptions,
a unique feature to WunderGraph.
WunderGraph is the only GraphQL Gateway that supports this feature.

Additionally, this example also shows Live Queries.
By using server-side Polling, we're able to turn any API into a realtime stream.

## Prerequisites

For all the demos, you need wunderctl, the cli to manage WunderGraph applications.
With wunderctl you can "init" new WunderGraph projects and start "up" a local dev environment.

Install it:

```shell
npm install -g @wundergraph/wunderctl
or
yarn global add @wundergraph/wunderctl
```

## Getting started

1. Start all four federated GraphQL services.

```shell
cd federation
docker-compose up
```

2. Start the local WunderGraph dev environment

```shell
cd .wundergraph
wunderctl up
```

3. Start the frontend

```shell
cd nextjs-frontend
yarn
yarn dev
```

Open your browser and go to `http://localhost:3000`

## How does it work?

Have a look at `./wundergraph/wundergraph.config.ts`.
The following code-snipped introspects the different APIs and merges them all together.

```typescript
const jsonPlaceholder = introspect.openApi({
    source: {
        kind: "file",
        filePath: "jsonplaceholder.v1.yaml",
    }
})

const federatedApi = introspect.federation({
    source: IntrospectionPolicy.Network,
    upstreams: [
        {
            url: "http://localhost:4001/graphql"
        },
        {
            url: "http://localhost:4002/graphql"
        },
        {
            url: "http://localhost:4003/graphql"
        },
        {
            url: "http://localhost:4004/graphql",
        },
    ]
});

const countries = introspect.graphql({
    url: "https://countries.trevorblades.com/",
    source: IntrospectionPolicy.Network,
})

const openAPI = introspect.openApi({
    source: {
        kind: "file",
        filePath: "users_oas.json"
    },
    headers: {
        "Authorization": "token"
    }
});

const renamedJsonPlaceholder = transformApi.renameTypes(jsonPlaceholder,{from: "User",to: "JSP_User"});

const myApplication = new Application({
    name: "app",
    apis: [
        federatedApi,
        openAPI,
        countries,
        renamedJsonPlaceholder,
    ],
});
```

## Hacking

### Modifying Operations

Go to `.wundergraph/operations`, add, remove or modify the operations.

### Updating the Frontend

Go to `nextjs-frontend/pages/index.tsx` and modify the UI, it definitely needs some love for the CSS!

### Adding or Removing DataSources

Go to `.wundergraph/wundergraph.config.ts` and modify the introspected DataSources. 