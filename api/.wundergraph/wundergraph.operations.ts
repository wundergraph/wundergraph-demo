import {configureWunderGraphOperations,QueryConfiguration,MutationConfiguration,SubscriptionConfiguration} from "@wundergraph/sdk";
import type { OperationsConfiguration } from "./generated/wundergraph.operations";

const enableAuth = <Configs extends QueryConfiguration | MutationConfiguration | SubscriptionConfiguration>(config: Configs): Configs => {
    return {
        ...config,
        authentication: {
            required: true
        }
    }
}

const enableCaching = (config: QueryConfiguration): QueryConfiguration =>
    ({...config, caching: {...config.caching, enable: true}});

export default configureWunderGraphOperations<OperationsConfiguration>({
        operations: {
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
                ProtectedWeather: enableAuth,
                ProtectedSetPrice: enableAuth,
                ProtectedPriceUpdates: enableAuth,
                Users: enableCaching,
            }
        }
    }
);