import {
    Application,
    configureWunderGraphApplication,
    cors,
    introspect,
    templates,
    authProviders
} from "@wundergraph/sdk";
import operations from "./wundergraph.operations";
import server from "./wundergraph.server";
import {NextJsTemplate} from '@wundergraph/nextjs/template';

const jsonPlaceholder = introspect.openApi({
    apiNamespace: "jsp",
    source: {
        kind: "file",
        filePath: "jsonplaceholder.v1.yaml",
    },
})

const weather = introspect.graphql({
    apiNamespace: "weather",
    url: "https://graphql-weather-api.herokuapp.com/",
    headers: builder => builder.addClientRequestHeader("Hello","Hello"),
});

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
    name: "api",
    apis: [
        federatedApi,
        countries,
        jsonPlaceholder,
        weather,
    ],
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
    application: myApplication,
    server,
    operations,
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
                new NextJsTemplate(),
            ],
            path: "../../nextjs-frontend/generated"
        }
    ],
    cors: {
        ...cors.allowAll,
        allowedOrigins: [
            "http://localhost:3000"
        ]
    },
    authentication: {
        cookieBased: {
            providers: [
                authProviders.demo(),
            ],
            authorizedRedirectUriRegexes: [
                "http://localhost:3000/*"
            ],
        }
    },
    authorization: {
      roles: [
          "admin",
          "user"
      ]
    },
    /*links: [
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
    ]*/
});
