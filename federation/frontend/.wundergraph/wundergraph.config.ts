import {Application, configureWunderGraph, introspect, IntrospectionPolicy, templates} from "@wundergraph/sdk";

const federatedApi = introspect.federation({
    source: IntrospectionPolicy.Network,
    urls: [
        "http://localhost:4001/graphql",
        "http://localhost:4002/graphql",
        "http://localhost:4003/graphql",
        "http://localhost:4004/graphql",
    ]
});

const myApplication = new Application({
    name: "app",
    apis: [
        federatedApi,
    ],
});

// configureWunderGraph emits the configuration
configureWunderGraph({
    applications: [myApplication],
    code_generators: [
        {
            templates: [
                // use all the typescript react templates to generate a client
                ...templates.typescript.react,
            ],
            // create-react-app expects all code to be inside /src
            path: "../src/generated",
        }
    ]
});
