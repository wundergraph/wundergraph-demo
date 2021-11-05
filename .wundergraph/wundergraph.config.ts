import {
    Application,
    configureWunderGraphApplication,
    cors,
    introspect,
    templates,
    authProviders
} from "@wundergraph/sdk";
import {appMock} from "./generated/mocks";
import transformApi from "@wundergraph/sdk/dist/transformations";
import linkBuilder from "./generated/linkbuilder";
import operations from "./wundergraph.operations";

const jsonPlaceholder = introspect.openApi({
    source: {
        kind: "file",
        filePath: "jsonplaceholder.v1.yaml",
    },
})

const federatedApi = introspect.federation({
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
})

const openAPI = introspect.openApi({
    source: {
        kind: "file",
        filePath: "users_oas.json"
    },
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

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
    application: myApplication,
    codeGenerators: [
        {
            templates: [
                templates.typescript.mocks,
                templates.typescript.operations,
                templates.typescript.namespaces,
                templates.typescript.linkBuilder,
                ...templates.typescript.all,
            ]
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
                authProviders.demo(),
            ],
            authorizedRedirectUris: [
                "http://localhost:3000/"
            ]
        }
    },
    links: [
        linkBuilder
            .source("userPosts")
            .target("JSP_User","posts")
            .argument("userID", "objectField", "id")
            .build(),
        linkBuilder
            .source("postComments")
            .target("Post","comments")
            .argument("postID", "objectField", "id")
            .build(),
    ]
});
