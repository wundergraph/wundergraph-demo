import {
    Application,
    configureWunderGraphApplication,
    cors,
    introspect,
    IntrospectionPolicy,
    templates,
    authProviders
} from "@wundergraph/sdk";
import {appMock} from "./generated/mocks";
import {
    BaseOperationConfiguration,
    ConfigureOperations,
    MutationConfiguration,
    QueryConfiguration, SubscriptionConfiguration
} from "./generated/operations";
import {config as dotEnvConfig} from "dotenv";
import environments from "./generated/environments";

dotEnvConfig();

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
    // You can add custom headers for APIs that require Authentication.
    /*
    headers: {
        Authorization: "Bearer token",
        "CustomHeader": "value"
    }*/
})

const openAPI = introspect.openApi({
    source: {
        kind: "file",
        filePath: "users_oas.json"
    },
});

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
        openAPI,
        countries,
        /*graphQLAPI*/
    ],
});

const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max)) + 1

const mock = appMock({
    queries: {
        FakeProducts: (input) => {
            return {
                data: {
                    topProducts: [
                        {
                            name: "foo",
                            price: randomInt(100),
                            upc: "bar",
                        },
                        {
                            name: "foo",
                            price: randomInt(100),
                            upc: "bar2"
                        }
                    ]
                }
            }
        },
        OasUsers: () => {
            return {
                data: {
                    getUsers: [
                        {
                            name: "Jens",
                            country_code: "DE",
                            id: 1,
                        }
                    ]
                }
            }
        }
    }
});

const enableCaching = (config: QueryConfiguration) :QueryConfiguration => ({
    ...config,
    caching: {
        ...config.caching,
        enable: true,
    }
});

const requireAuth = (config: QueryConfiguration) : QueryConfiguration => ({
    ...config,
    authentication: {
        required: true,
    }
})

const operations: ConfigureOperations = {
    defaultConfig: {
        authentication: {
            required: false,
        }
    },
    queries: config => {
        return {
            ...config,
            kind: "query",
            caching: {
                enable: false,
                public: true,
                maxAge: 10,
                staleWhileRevalidate: 5,
            }
        }
    },
    subscriptions: config => ({
        ...config,
        kind: "subscription",
    }),
    mutations: config => ({
        ...config,
        kind: "mutation"
    }),
    custom: {
        Countries: enableCaching,
        TopProducts: enableCaching,
        OasUsers: requireAuth,
        PriceUpdates: config => ({
            ...config,
            authentication: {
                required: true,
            }
        }),
    }
}

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
    application: myApplication,
    codeGenerators: [
        {
            templates: [
                templates.typescript.mocks,
                templates.typescript.operations,
                templates.typescript.environments.default,
            ]
        },
        {
            templates: [
                // use all the typescript react templates to generate a client
                ...templates.typescript.react,
            ],
            // create-react-app expects all code to be inside /src
            path: "../vitejs-react/src/generated",
        },
        {
            templates: [
                ...templates.typescript.react,
            ],
            path: "../nextjs-frontend/generated"
        }
    ],
    mock,
    cors: {
        ...cors.allowAll,
        allowedOrigins: [
            "http://localhost:3000"
        ]
    },
    operations,
    authentication: {
        cookieBased: {
            providers: [
                new authProviders.github({
                    id: "github",
                    "clientId": process.env.GITHUB_CLIENT_ID!,
                    "clientSecret": process.env.GITHUB_CLIENT_SECRET!,
                }),
            ]
        }
    },
});
