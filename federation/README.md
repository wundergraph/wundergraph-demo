# WunderGraph Federation Demo

## Prerequisites

Install wunderctl

```shell
npm install -g @wundergraph/wunderctl
or
yarn global add @wundergraph/wunderctl
```

## Getting started

1. Start all four federated services.

```shell
cd federation
docker-compose up
cd frontend
yarn
yarn dev
```

2. Start the local WunderGraph dev environment

```shell
cd federation/frontend/.wundergraph
wunderctl up
```

3. Start the frontend

```shell
cd federation/frontend
yarn
yarn dev
```

Open your browser and click "enable" to start the subscription.

## Hacking

You might want to modify your Operations and re-generate the code.
To accomplish this, you have to start the code-generator.

```shell
cd federation/frontend/.wundergraph
yarn
yarn dev
```

Once the code-generator is up and running you can modify your operations by updating this file:

    federation/frontend/.wundergraph/wundergraph.app.operations.graphql

Happy hacking!