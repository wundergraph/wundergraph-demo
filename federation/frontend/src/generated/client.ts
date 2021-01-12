import { MeResponse, UpdatedPricesResponse, SetPriceInput, SetPriceResponse } from "./models";

export type Response<T> = ResponseOK<T> | Loading | Aborted | Error;

export interface ResponseOK<T> {
	status: "ok";
	body: T;
}

export interface Loading {
	status: "loading";
}

export interface Aborted {
	status: "aborted";
}

export interface Error {
	status: "error";
	message: string;
}

interface FetchConfig {
	method: "GET" | "POST";
	path: string;
	input?: Object;
	abortSignal?: AbortSignal;
}

export interface RequestOptions<T = never> {
	input?: T;
	abortSignal?: AbortSignal;
}

export class Client {
	constructor(baseURL?: string) {
		this.baseURL = baseURL || this.baseURL;
	}
	private readonly baseURL: string = "http://localhost:9991";
	private readonly applicationID: string = "app";
	public query = {
		Me: async (options: RequestOptions) => {
			return await this.doFetch<MeResponse>({
				method: "GET",
				path: "Me",
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
		UpdatedPrices: (options: RequestOptions, cb: (response: Response<UpdatedPricesResponse>) => void) => {
			return this.startSubscription<UpdatedPricesResponse>(
				{
					method: "GET",
					path: "UpdatedPrices",
					input: options.input,
					abortSignal: options.abortSignal,
				},
				cb
			);
		},
	};
	private doFetch = async <T>(fetchConfig: FetchConfig): Promise<Response<T>> => {
		try {
			const params = this.queryString({
				v: fetchConfig.input,
			});
			const response = await fetch(this.baseURL + "/" + this.applicationID + "/" + fetchConfig.path + params, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/vnd.wundergraph.com",
				},
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

				const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

				let message: string = "";

				while (true) {
					const { value, done } = await reader.read();
					if (done) break;
					if (!value) continue;
					message += value;
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
