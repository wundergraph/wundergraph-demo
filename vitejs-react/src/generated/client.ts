import {
	TopProductsResponse,
	FakeProductsInput,
	FakeProductsResponse,
	OasUsersResponse,
	PriceUpdatesResponse,
	SetPriceInput,
	SetPriceResponse,
} from "./models";

export type Response<T> = ResponseOK<T> | Refetch<T> | Loading | Aborted | Error | None;

export interface ResponseOK<T> {
	status: "ok";
	body: T;
}

export interface Loading {
	status: "loading";
}

export interface Refetch<T> extends ResponseOK<T> {
	refetching: true;
}

export interface Aborted {
	status: "aborted";
}

export interface Error {
	status: "error";
	message: string;
}

export interface None {
	status: "none";
}

interface FetchConfig {
	method: "GET" | "POST";
	path: string;
	input?: Object;
	abortSignal?: AbortSignal;
}

export interface MutateRequestOptions<Input = never> {
	input?: Input;
	abortSignal?: AbortSignal;
}

export interface RequestOptions<Input = never, InitialState = never> {
	input?: Input;
	abortSignal?: AbortSignal;
	initialState?: InitialState;
}

export class Client {
	constructor(baseURL?: string) {
		this.baseURL = baseURL || this.baseURL;
	}
	private readonly baseURL: string = "http://localhost:9991";
	private readonly applicationID: string = "app";
	public query = {
		TopProducts: async (options: RequestOptions) => {
			return await this.doFetch<TopProductsResponse>({
				method: "GET",
				path: "TopProducts",
				input: options.input,
				abortSignal: options.abortSignal,
			});
		},
		FakeProducts: async (options: RequestOptions<FakeProductsInput>) => {
			return await this.doFetch<FakeProductsResponse>({
				method: "GET",
				path: "FakeProducts",
				input: options.input,
				abortSignal: options.abortSignal,
			});
		},
		OasUsers: async (options: RequestOptions) => {
			return await this.doFetch<OasUsersResponse>({
				method: "GET",
				path: "OasUsers",
				input: options.input,
				abortSignal: options.abortSignal,
			});
		},
	};
	public mutation = {
		SetPrice: async (options: RequestOptions<SetPriceInput>) => {
			return await this.doFetch<SetPriceResponse>({
				method: "POST",
				path: "SetPrice",
				input: options.input,
				abortSignal: options.abortSignal,
			});
		},
	};
	public subscription = {
		PriceUpdates: (options: RequestOptions, cb: (response: Response<PriceUpdatesResponse>) => void) => {
			return this.startSubscription<PriceUpdatesResponse>(
				{
					method: "GET",
					path: "PriceUpdates",
					input: options.input,
					abortSignal: options.abortSignal,
				},
				cb
			);
		},
	};
	private doFetch = async <T>(fetchConfig: FetchConfig): Promise<Response<T>> => {
		try {
			const params =
				fetchConfig.method !== "POST"
					? this.queryString({
							v: fetchConfig.input,
					  })
					: "";
			const body = fetchConfig.method === "POST" ? JSON.stringify(fetchConfig.input) : undefined;
			const response = await fetch(this.baseURL + "/" + this.applicationID + "/" + fetchConfig.path + params, {
				headers: {
					Accept: "application/json",
				},
				body,
				method: fetchConfig.method,
				signal: fetchConfig.abortSignal,
			});
			const data = await response.json();
			return {
				status: "ok",
				body: data,
			};
		} catch (e) {
			return {
				status: "error",
				message: e,
			};
		}
	};
	private startSubscription = <T>(fetchConfig: FetchConfig, cb: (response: Response<T>) => void) => {
		(async () => {
			try {
				const params = this.queryString({
					v: fetchConfig.input,
				});
				const response = await fetch(this.baseURL + "/" + this.applicationID + "/" + fetchConfig.path + params, {
					headers: {
						"Content-Type": "application/vnd.wundergraph.com",
					},
					method: fetchConfig.method,
					signal: fetchConfig.abortSignal,
				});

				if (response.status !== 200 || response.body == null) {
					return;
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();

				let message: string = "";

				while (true) {
					const { value, done } = await reader.read();
					if (done) break;
					if (!value) continue;
					message += decoder.decode(value);
					if (message.endsWith("\n\n")) {
						cb({
							status: "ok",
							body: JSON.parse(message.substring(0, message.length - 2)),
						});
						message = "";
					}
				}
			} catch (e) {
				cb({
					status: "error",
					message: e,
				});
			}
		})();
	};
	private queryString = (input?: Object): string => {
		if (!input) {
			return "";
		}
		const query = (Object.keys(input) as Array<keyof typeof input>)
			// @ts-ignore
			.filter((key) => input[key] !== undefined && input[key] !== "")
			.map((key) => {
				const value = typeof input[key] === "object" ? JSON.stringify(input[key]) : input[key];
				const encodedKey = encodeURIComponent(key);
				// @ts-ignore
				const encodedValue = encodeURIComponent(value);
				return `${encodedKey}=${encodedValue}`;
			})
			.join("&");
		return query === "" ? query : "?" + query;
	};
}
