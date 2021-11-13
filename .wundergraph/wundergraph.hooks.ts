import {configureWunderGraphHooks} from "./generated/wundergraph.hooks.configuration"

const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max)) + 1

const wunderGraphHooks = configureWunderGraphHooks({
    queries: {
        FakeProducts: {
            mockResolve: async (ctx,input) => {
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
});

export default wunderGraphHooks;
