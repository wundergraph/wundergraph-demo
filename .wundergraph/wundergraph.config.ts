import {
    Application,
    configureWunderGraphApplication,
    cors,
    introspect,
    templates,
    authProviders
} from "@wundergraph/sdk";
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

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
    application: myApplication,
    codeGenerators: [
        {
            templates: [
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
