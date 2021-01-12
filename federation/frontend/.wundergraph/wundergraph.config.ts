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

/*
uncomment this section to create an API from an OpenAPI Specification

const openAPI = introspect.openApi({
    source: {
        kind: "file",
        filePath: "my_api_oas.json"
    },
});*/

/*
uncomment this section to create an API from a GraphQL upstream

const graphQLAPI = introspect.graphql({
    source: IntrospectionPolicy.Network,
    url: "http://localhost:4000",
});*/

const myApplication = new Application({
    name: "app",
    apis: [
        federatedApi,
        /*openAPI,
        graphQLAPI*/
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
