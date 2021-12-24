import {
    Application,
    configureWunderGraphApplication,
    cors,
    introspect,
    templates,
    authProviders
} from "@wundergraph/sdk";
import linkBuilder from "./generated/linkbuilder";
import operations from "./wundergraph.operations";

const jsonPlaceholder = introspect.openApi({
    apiNamespace: "jsp",
    source: {
        kind: "file",
        filePath: "jsonplaceholder.v1.yaml",
    },
})

const federatedApi = introspect.federation({
    apiNamespace: "federated",
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
    apiNamespace: "countries",
    url: "https://countries.trevorblades.com/",
})

const myApplication = new Application({
    name: "app",
    apis: [
        federatedApi,
        countries,
        jsonPlaceholder,
    ],
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
    application: myApplication,
    codeGenerators: [
        {
            templates: [
                templates.typescript.operations,
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
    authorization: {
      roles: [
          "admin",
          "user"
      ]
    },
    links: [
        linkBuilder
            .source("jsp_userPosts")
            .target("jsp_User","posts")
            .argument("userID", "objectField", "id")
            .build(),
        linkBuilder
            .source("jsp_postComments")
            .target("jsp_Post","comments")
            .argument("postID", "objectField", "id")
            .build(),
    ]
});
