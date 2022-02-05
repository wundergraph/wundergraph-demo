import {
    configureWunderGraphOperations,
    MutationConfiguration,
    QueryConfiguration, SubscriptionConfiguration
} from "./generated/wundergraph.operations.configuration";

const disableAuth = <Configs extends QueryConfiguration | MutationConfiguration | SubscriptionConfiguration>(config: Configs) :Configs => {
    return {
        ...config,
        authentication: {
            required: false
        }
    }
}

const enableAuth = <Configs extends QueryConfiguration | MutationConfiguration | SubscriptionConfiguration>(config: Configs) :Configs => {
    return {
        ...config,
        authentication: {
            required: true
        }
    }
}

const enableCaching = (config: QueryConfiguration): QueryConfiguration =>
    ({...config, caching: {...config.caching, enable: true}});

const operations = configureWunderGraphOperations({
    defaultConfig: {
        authentication: {
            required: false
        }
    },
    queries: config => ({
        ...config,
        caching: {
            enable: false,
            staleWhileRevalidate: 60,
            maxAge: 60,
            public: true
        },
        liveQuery: {
            enable: true,
            pollingIntervalSeconds: 1,
        }
    }),
    mutations: config => ({
        ...config,
    }),
    subscriptions: config => ({
        ...config,
    }),
    custom: {
        Countries: enableCaching,
        TopProducts: config => ({
            ...config,
            caching: {
                ...config.caching,
                enable: true
            },
            liveQuery: {
                enable: true,
                pollingIntervalSeconds: 2,
            },
            authentication: {
                required: false,
            }
        }),
        PriceUpdates: config => ({
            ...config,
            authentication: {
                required: false,
            }
        }),
        Users: enableCaching,
    }
});

export default operations;