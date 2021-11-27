import Fastify from "fastify";
import axios from "axios";
import {
	CountriesResponse,
	FakeProductsResponse,
	FakeProductsInput,
	InternalFakeProductsInput,
	InjectedFakeProductsInput,
	PriceUpdatesResponse,
	SetPriceResponse,
	SetPriceInput,
	InternalSetPriceInput,
	InjectedSetPriceInput,
	TopProductsResponse,
	UsersResponse,
} from "./models";
import { HooksConfiguration } from "@wundergraph/sdk/dist/configure";

declare module "fastify" {
	interface FastifyRequest {
		/**
		 * Coming soon!
		 */
		ctx: Context;
	}
}

export interface Context {
	user?: User;
}

export interface User {
	provider?: string;
	provider_id?: string;
	email?: string;
	email_verified?: boolean;
	name?: string;
	first_name?: string;
	last_name?: string;
	nick_name?: string;
	description?: string;
	user_id?: string;
	avatar_url?: string;
	location?: string;
	roles?: Role[];
}

export type Role = "admin" | "user";

export type AuthenticationResponse = AuthenticationOK | AuthenticationDeny;

export interface AuthenticationOK {
	status: "ok";
	user: User;
	message?: never;
}

export interface AuthenticationDeny {
	status: "deny";
	user?: never;
	message?: string;
}

const internalClientAuthorizationHeader = "Bearer internalRequestToken";

const internalRequest = async (operationName: string, input?: any): Promise<any> => {
	const url = "http://localhost:9991/internal/api/main/operations/" + operationName;
	const res = await axios.post(url, JSON.stringify(input || {}), {
		headers: {
			"Content-Type": "application/json",
			Authorization: internalClientAuthorizationHeader,
		},
	});
	return res.data;
};

interface InternalClient {
	queries: {
		Countries: () => Promise<CountriesResponse>;
		FakeProducts: (input: InternalFakeProductsInput) => Promise<FakeProductsResponse>;
		TopProducts: () => Promise<TopProductsResponse>;
		Users: () => Promise<UsersResponse>;
	};
	mutations: {
		SetPrice: (input: InternalSetPriceInput) => Promise<SetPriceResponse>;
	};
}

const client = {
	queries: {
		Countries: async () => internalRequest("Countries"),
		FakeProducts: async (input: InternalFakeProductsInput) => internalRequest("FakeProducts", input),
		TopProducts: async () => internalRequest("TopProducts"),
		Users: async () => internalRequest("Users"),
	},
	mutations: {
		SetPrice: async (input: InternalSetPriceInput) => internalRequest("SetPrice", input),
	},
};

export const configureWunderGraphHooksWithClient = (config: (client: InternalClient) => HooksConfig) =>
	configureWunderGraphHooks(config(client));

export interface HooksConfig {
	authentication?: {
		postAuthentication?: (user: User) => Promise<void>;
		mutatingPostAuthentication?: (user: User) => Promise<AuthenticationResponse>;
		revalidate?: (user: User) => Promise<AuthenticationResponse>;
	};
	queries?: {
		Countries?: {
			mockResolve?: (ctx: Context) => Promise<CountriesResponse>;
			preResolve?: (ctx: Context) => Promise<void>;
			postResolve?: (ctx: Context, response: CountriesResponse) => Promise<void>;
			mutatingPostResolve?: (ctx: Context, response: CountriesResponse) => Promise<CountriesResponse>;
		};
		FakeProducts?: {
			mockResolve?: (ctx: Context, input: InjectedFakeProductsInput) => Promise<FakeProductsResponse>;
			preResolve?: (ctx: Context, input: InjectedFakeProductsInput) => Promise<void>;
			mutatingPreResolve?: (ctx: Context, input: InjectedFakeProductsInput) => Promise<InjectedFakeProductsInput>;
			postResolve?: (ctx: Context, input: InjectedFakeProductsInput, response: FakeProductsResponse) => Promise<void>;
			mutatingPostResolve?: (
				ctx: Context,
				input: InjectedFakeProductsInput,
				response: FakeProductsResponse
			) => Promise<FakeProductsResponse>;
		};
		TopProducts?: {
			mockResolve?: (ctx: Context) => Promise<TopProductsResponse>;
			preResolve?: (ctx: Context) => Promise<void>;
			postResolve?: (ctx: Context, response: TopProductsResponse) => Promise<void>;
			mutatingPostResolve?: (ctx: Context, response: TopProductsResponse) => Promise<TopProductsResponse>;
		};
		Users?: {
			mockResolve?: (ctx: Context) => Promise<UsersResponse>;
			preResolve?: (ctx: Context) => Promise<void>;
			postResolve?: (ctx: Context, response: UsersResponse) => Promise<void>;
			mutatingPostResolve?: (ctx: Context, response: UsersResponse) => Promise<UsersResponse>;
		};
	};
	mutations?: {
		SetPrice?: {
			mockResolve?: (ctx: Context, input: InjectedSetPriceInput) => Promise<SetPriceResponse>;
			preResolve?: (ctx: Context, input: InjectedSetPriceInput) => Promise<void>;
			mutatingPreResolve?: (ctx: Context, input: InjectedSetPriceInput) => Promise<InjectedSetPriceInput>;
			postResolve?: (ctx: Context, input: InjectedSetPriceInput, response: SetPriceResponse) => Promise<void>;
			mutatingPostResolve?: (
				ctx: Context,
				input: InjectedSetPriceInput,
				response: SetPriceResponse
			) => Promise<SetPriceResponse>;
		};
	};
}

export const configureWunderGraphHooks = (config: HooksConfig) => {
	const hooksConfig: HooksConfiguration = {
		queries: config.queries as { [name: string]: { preResolve: any; postResolve: any; mutatingPostResolve: any } },
		mutations: config.mutations as { [name: string]: { preResolve: any; postResolve: any; mutatingPostResolve: any } },
		authentication: config.authentication as {
			postAuthentication?: any;
			mutatingPostAuthentication?: any;
			revalidate?: any;
		},
	};
	const server = {
		config: hooksConfig,
		start() {
			const fastify = Fastify({
				logger: true,
			});

			fastify.addHook<{ Body: { user: User } }>("preHandler", async (req, reply) => {
				req.ctx = {
					user: req.body.user,
				};
			});

			// authentication
			fastify.post("/authentication/postAuthentication", async (request, reply) => {
				reply.type("application/json").code(200);
				if (config.authentication?.postAuthentication !== undefined && request.ctx.user !== undefined) {
					try {
						await config.authentication.postAuthentication(request.ctx.user);
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { hook: "postAuthentication", error: err };
					}
				}
				return {
					hook: "postAuthentication",
				};
			});
			fastify.post("/authentication/mutatingPostAuthentication", async (request, reply) => {
				reply.type("application/json").code(200);
				if (config.authentication?.mutatingPostAuthentication !== undefined && request.ctx.user !== undefined) {
					try {
						const out = await config.authentication.mutatingPostAuthentication(request.ctx.user);
						return {
							hook: "mutatingPostAuthentication",
							response: out,
						};
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { hook: "mutatingPostAuthentication", error: err };
					}
				}
			});
			fastify.post("/authentication/revalidateAuthentication", async (request, reply) => {
				reply.type("application/json").code(200);
				if (config.authentication?.revalidate !== undefined && request.ctx.user !== undefined) {
					try {
						const out = await config.authentication.revalidate(request.ctx.user);
						return {
							hook: "revalidateAuthentication",
							response: out,
						};
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { hook: "revalidateAuthentication", error: err };
					}
				}
			});

			/**
			 * Queries
			 */

			// mock
			fastify.post("/operation/Countries/mockResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					const mutated = await config?.queries?.Countries?.mockResolve?.(request.ctx);
					return { op: "Countries", hook: "mock", response: mutated };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "Countries", hook: "mock", error: err };
				}
			});

			// preResolve
			fastify.post("/operation/Countries/preResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.queries?.Countries?.preResolve?.(request.ctx);
					return { op: "Countries", hook: "preResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "Countries", hook: "preResolve", error: err };
				}
			});
			// postResolve
			fastify.post<{ Body: { response: CountriesResponse } }>(
				"/operation/Countries/postResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						await config?.queries?.Countries?.postResolve?.(request.ctx, request.body.response);
						return { op: "Countries", hook: "postResolve" };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "Countries", hook: "postResolve", error: err };
					}
				}
			);
			// mutatingPostResolve
			fastify.post<{ Body: { response: CountriesResponse } }>(
				"/operation/Countries/mutatingPostResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.queries?.Countries?.mutatingPostResolve?.(request.ctx, request.body.response);
						return { op: "Countries", hook: "mutatingPostResolve", response: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "Countries", hook: "mutatingPostResolve", error: err };
					}
				}
			);

			// mock
			fastify.post<{ Body: { input: InjectedFakeProductsInput } }>(
				"/operation/FakeProducts/mockResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.queries?.FakeProducts?.mockResolve?.(request.ctx, request.body.input);
						return { op: "FakeProducts", hook: "mock", response: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "FakeProducts", hook: "mock", error: err };
					}
				}
			);

			// preResolve
			fastify.post<{ Body: { input: InjectedFakeProductsInput } }>(
				"/operation/FakeProducts/preResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						await config?.queries?.FakeProducts?.preResolve?.(request.ctx, request.body.input);
						return { op: "FakeProducts", hook: "preResolve" };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "FakeProducts", hook: "preResolve", error: err };
					}
				}
			);
			// postResolve
			fastify.post<{ Body: { input: InjectedFakeProductsInput; response: FakeProductsResponse } }>(
				"/operation/FakeProducts/postResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						await config?.queries?.FakeProducts?.postResolve?.(request.ctx, request.body.input, request.body.response);
						return { op: "FakeProducts", hook: "postResolve" };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "FakeProducts", hook: "postResolve", error: err };
					}
				}
			);
			// mutatingPreResolve
			fastify.post<{ Body: { input: InjectedFakeProductsInput } }>(
				"/operation/FakeProducts/mutatingPreResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.queries?.FakeProducts?.mutatingPreResolve?.(request.ctx, request.body.input);
						return { op: "FakeProducts", hook: "mutatingPreResolve", input: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "FakeProducts", hook: "mutatingPreResolve", error: err };
					}
				}
			);
			// mutatingPostResolve
			fastify.post<{ Body: { input: InjectedFakeProductsInput; response: FakeProductsResponse } }>(
				"/operation/FakeProducts/mutatingPostResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.queries?.FakeProducts?.mutatingPostResolve?.(
							request.ctx,
							request.body.input,
							request.body.response
						);
						return { op: "FakeProducts", hook: "mutatingPostResolve", response: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "FakeProducts", hook: "mutatingPostResolve", error: err };
					}
				}
			);

			// mock
			fastify.post("/operation/TopProducts/mockResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					const mutated = await config?.queries?.TopProducts?.mockResolve?.(request.ctx);
					return { op: "TopProducts", hook: "mock", response: mutated };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "TopProducts", hook: "mock", error: err };
				}
			});

			// preResolve
			fastify.post("/operation/TopProducts/preResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.queries?.TopProducts?.preResolve?.(request.ctx);
					return { op: "TopProducts", hook: "preResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "TopProducts", hook: "preResolve", error: err };
				}
			});
			// postResolve
			fastify.post<{ Body: { response: TopProductsResponse } }>(
				"/operation/TopProducts/postResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						await config?.queries?.TopProducts?.postResolve?.(request.ctx, request.body.response);
						return { op: "TopProducts", hook: "postResolve" };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "TopProducts", hook: "postResolve", error: err };
					}
				}
			);
			// mutatingPostResolve
			fastify.post<{ Body: { response: TopProductsResponse } }>(
				"/operation/TopProducts/mutatingPostResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.queries?.TopProducts?.mutatingPostResolve?.(
							request.ctx,
							request.body.response
						);
						return { op: "TopProducts", hook: "mutatingPostResolve", response: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "TopProducts", hook: "mutatingPostResolve", error: err };
					}
				}
			);

			// mock
			fastify.post("/operation/Users/mockResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					const mutated = await config?.queries?.Users?.mockResolve?.(request.ctx);
					return { op: "Users", hook: "mock", response: mutated };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "Users", hook: "mock", error: err };
				}
			});

			// preResolve
			fastify.post("/operation/Users/preResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.queries?.Users?.preResolve?.(request.ctx);
					return { op: "Users", hook: "preResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "Users", hook: "preResolve", error: err };
				}
			});
			// postResolve
			fastify.post<{ Body: { response: UsersResponse } }>("/operation/Users/postResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.queries?.Users?.postResolve?.(request.ctx, request.body.response);
					return { op: "Users", hook: "postResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "Users", hook: "postResolve", error: err };
				}
			});
			// mutatingPostResolve
			fastify.post<{ Body: { response: UsersResponse } }>(
				"/operation/Users/mutatingPostResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.queries?.Users?.mutatingPostResolve?.(request.ctx, request.body.response);
						return { op: "Users", hook: "mutatingPostResolve", response: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "Users", hook: "mutatingPostResolve", error: err };
					}
				}
			);

			/**
			 * Mutations
			 */

			// mock
			fastify.post<{ Body: { input: InjectedSetPriceInput } }>(
				"/operation/SetPrice/mockResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.mutations?.SetPrice?.mockResolve?.(request.ctx, request.body.input);
						return { op: "SetPrice", hook: "mock", response: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "SetPrice", hook: "mock", error: err };
					}
				}
			);

			// preResolve
			fastify.post<{ Body: { input: InjectedSetPriceInput } }>(
				"/operation/SetPrice/preResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						await config?.mutations?.SetPrice?.preResolve?.(request.ctx, request.body.input);
						return { op: "SetPrice", hook: "preResolve" };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "SetPrice", hook: "preResolve", error: err };
					}
				}
			);
			// postResolve
			fastify.post<{ Body: { input: InjectedSetPriceInput; response: SetPriceResponse } }>(
				"/operation/SetPrice/postResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						await config?.mutations?.SetPrice?.postResolve?.(request.ctx, request.body.input, request.body.response);
						return { op: "SetPrice", hook: "postResolve" };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "SetPrice", hook: "postResolve", error: err };
					}
				}
			);
			// mutatingPreResolve
			fastify.post<{ Body: { input: InjectedSetPriceInput } }>(
				"/operation/SetPrice/mutatingPreResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.mutations?.SetPrice?.mutatingPreResolve?.(request.ctx, request.body.input);
						return { op: "SetPrice", hook: "mutatingPreResolve", input: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "SetPrice", hook: "mutatingPreResolve", error: err };
					}
				}
			);
			// mutatingPostResolve
			fastify.post<{ Body: { input: InjectedSetPriceInput; response: SetPriceResponse } }>(
				"/operation/SetPrice/mutatingPostResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.mutations?.SetPrice?.mutatingPostResolve?.(
							request.ctx,
							request.body.input,
							request.body.response
						);
						return { op: "SetPrice", hook: "mutatingPostResolve", response: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "SetPrice", hook: "mutatingPostResolve", error: err };
					}
				}
			);

			fastify.listen(9992, (err, address) => {
				if (err) {
					console.error(err);
					process.exit(0);
				}
				console.log(`hooks server listening at ${address}`);
			});
		},
	};

	if (process.env.START_HOOKS_SERVER === "true") {
		server.start();
	}

	return server;
};
