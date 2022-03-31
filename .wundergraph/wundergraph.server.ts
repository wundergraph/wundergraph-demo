import {configureWunderGraphServer} from "@wundergraph/sdk";
import type {GraphQLExecutionContext} from "./generated/wundergraph.server"
import type {HooksConfig} from "./generated/wundergraph.hooks";
import type {InternalClient} from "./generated/wundergraph.internal.client";

const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max)) + 1

export default configureWunderGraphServer<HooksConfig,
    InternalClient>((serverContext) => ({
    hooks: {
        queries: {
            FakeProducts: {
                mockResolve: async (ctx, input) => {
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
                }
            },
            OasUsers: {
                mockResolve: async () => {
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
        }
    }
}));