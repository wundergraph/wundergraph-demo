import Fastify from "fastify";
import {
	CountriesResponse,
	FakeProductsInput,
	FakeProductsResponse,
	OasUsersResponse,
	PriceUpdatesResponse,
	SetPriceInput,
	SetPriceResponse,
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
}

export interface HooksConfig {
	queries?: {
		Countries?: {
			preResolve?: (ctx: Context) => Promise<void>;
			postResolve?: (ctx: Context, response: CountriesResponse) => Promise<void>;
			mutatingPostResolve?: (ctx: Context, response: CountriesResponse) => Promise<CountriesResponse>;
		};
		FakeProducts?: {
			preResolve?: (ctx: Context, input: FakeProductsInput) => Promise<void>;
			mutatingPreResolve?: (ctx: Context, input: FakeProductsInput) => Promise<FakeProductsInput>;
			postResolve?: (ctx: Context, input: FakeProductsInput, response: FakeProductsResponse) => Promise<void>;
			mutatingPostResolve?: (
				ctx: Context,
				input: FakeProductsInput,
				response: FakeProductsResponse
			) => Promise<FakeProductsResponse>;
		};
		OasUsers?: {
			preResolve?: (ctx: Context) => Promise<void>;
			postResolve?: (ctx: Context, response: OasUsersResponse) => Promise<void>;
			mutatingPostResolve?: (ctx: Context, response: OasUsersResponse) => Promise<OasUsersResponse>;
		};
		TopProducts?: {
			preResolve?: (ctx: Context) => Promise<void>;
			postResolve?: (ctx: Context, response: TopProductsResponse) => Promise<void>;
			mutatingPostResolve?: (ctx: Context, response: TopProductsResponse) => Promise<TopProductsResponse>;
		};
		Users?: {
			preResolve?: (ctx: Context) => Promise<void>;
			postResolve?: (ctx: Context, response: UsersResponse) => Promise<void>;
			mutatingPostResolve?: (ctx: Context, response: UsersResponse) => Promise<UsersResponse>;
		};
	};
	mutations?: {
		SetPrice?: {
			preResolve?: (ctx: Context, input: SetPriceInput) => Promise<void>;
			mutatingPreResolve?: (ctx: Context, input: SetPriceInput) => Promise<SetPriceInput>;
			postResolve?: (ctx: Context, input: SetPriceInput, response: SetPriceResponse) => Promise<void>;
			mutatingPostResolve?: (
				ctx: Context,
				input: SetPriceInput,
				response: SetPriceResponse
			) => Promise<SetPriceResponse>;
		};
	};
}

export const configureWunderGraphHooks = (config: HooksConfig) => {
	const hooksConfig: HooksConfiguration = {
		queries: config.queries as { [name: string]: { preResolve: any; postResolve: any; mutatingPostResolve: any } },
		mutations: config.mutations as { [name: string]: { preResolve: any; postResolve: any; mutatingPostResolve: any } },
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

			/**
			 * Queries
			 */

			// preResolve
			fastify.post("/Countries/preResolve", async (request, reply) => {
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
			fastify.post<{ Body: { response: CountriesResponse } }>("/Countries/postResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.queries?.Countries?.postResolve?.(request.ctx, request.body.response);
					return { op: "Countries", hook: "postResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "Countries", hook: "postResolve", error: err };
				}
			});
			// mutatingPostResolve
			fastify.post<{ Body: { response: CountriesResponse } }>(
				"/Countries/mutatingPostResolve",
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

			// preResolve
			fastify.post<{ Body: { input: FakeProductsInput } }>("/FakeProducts/preResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.queries?.FakeProducts?.preResolve?.(request.ctx, request.body.input);
					return { op: "FakeProducts", hook: "preResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "FakeProducts", hook: "preResolve", error: err };
				}
			});
			// postResolve
			fastify.post<{ Body: { input: FakeProductsInput; response: FakeProductsResponse } }>(
				"/FakeProducts/postResolve",
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
			fastify.post<{ Body: { input: FakeProductsInput } }>(
				"/FakeProducts/mutatingPreResolve",
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
			fastify.post<{ Body: { input: FakeProductsInput; response: FakeProductsResponse } }>(
				"/FakeProducts/mutatingPostResolve",
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

			// preResolve
			fastify.post("/OasUsers/preResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.queries?.OasUsers?.preResolve?.(request.ctx);
					return { op: "OasUsers", hook: "preResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "OasUsers", hook: "preResolve", error: err };
				}
			});
			// postResolve
			fastify.post<{ Body: { response: OasUsersResponse } }>("/OasUsers/postResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.queries?.OasUsers?.postResolve?.(request.ctx, request.body.response);
					return { op: "OasUsers", hook: "postResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "OasUsers", hook: "postResolve", error: err };
				}
			});
			// mutatingPostResolve
			fastify.post<{ Body: { response: OasUsersResponse } }>(
				"/OasUsers/mutatingPostResolve",
				async (request, reply) => {
					reply.type("application/json").code(200);
					try {
						const mutated = await config?.queries?.OasUsers?.mutatingPostResolve?.(request.ctx, request.body.response);
						return { op: "OasUsers", hook: "mutatingPostResolve", response: mutated };
					} catch (err) {
						request.log.error(err);
						reply.code(500);
						return { op: "OasUsers", hook: "mutatingPostResolve", error: err };
					}
				}
			);

			// preResolve
			fastify.post("/TopProducts/preResolve", async (request, reply) => {
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
			fastify.post<{ Body: { response: TopProductsResponse } }>("/TopProducts/postResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.queries?.TopProducts?.postResolve?.(request.ctx, request.body.response);
					return { op: "TopProducts", hook: "postResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "TopProducts", hook: "postResolve", error: err };
				}
			});
			// mutatingPostResolve
			fastify.post<{ Body: { response: TopProductsResponse } }>(
				"/TopProducts/mutatingPostResolve",
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

			// preResolve
			fastify.post("/Users/preResolve", async (request, reply) => {
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
			fastify.post<{ Body: { response: UsersResponse } }>("/Users/postResolve", async (request, reply) => {
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
			fastify.post<{ Body: { response: UsersResponse } }>("/Users/mutatingPostResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					const mutated = await config?.queries?.Users?.mutatingPostResolve?.(request.ctx, request.body.response);
					return { op: "Users", hook: "mutatingPostResolve", response: mutated };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "Users", hook: "mutatingPostResolve", error: err };
				}
			});

			/**
			 * Mutations
			 */

			// preResolve
			fastify.post<{ Body: { input: SetPriceInput } }>("/SetPrice/preResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					await config?.mutations?.SetPrice?.preResolve?.(request.ctx, request.body.input);
					return { op: "SetPrice", hook: "preResolve" };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "SetPrice", hook: "preResolve", error: err };
				}
			});
			// postResolve
			fastify.post<{ Body: { input: SetPriceInput; response: SetPriceResponse } }>(
				"/SetPrice/postResolve",
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
			fastify.post<{ Body: { input: SetPriceInput } }>("/SetPrice/mutatingPreResolve", async (request, reply) => {
				reply.type("application/json").code(200);
				try {
					const mutated = await config?.mutations?.SetPrice?.mutatingPreResolve?.(request.ctx, request.body.input);
					return { op: "SetPrice", hook: "mutatingPreResolve", input: mutated };
				} catch (err) {
					request.log.error(err);
					reply.code(500);
					return { op: "SetPrice", hook: "mutatingPreResolve", error: err };
				}
			});
			// mutatingPostResolve
			fastify.post<{ Body: { input: SetPriceInput; response: SetPriceResponse } }>(
				"/SetPrice/mutatingPostResolve",
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
