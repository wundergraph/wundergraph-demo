import {
	TopProductsResponse,
	FakeProductsInput,
	FakeProductsResponse,
	OasUsersResponse,
	PriceUpdatesResponse,
	SetPriceInput,
	SetPriceResponse,
	CountriesResponse,
} from "./models";

export type Response<T> = ResponseOK<T> | Refetch<T> | Loading | Aborted | Error | None | RequiresAuthentication;

export interface ResponseOK<T> {
	status: "ok";
	body: T;
}

export interface RequiresAuthentication {
	status: "requiresAuthentication";
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
	liveQuery?: boolean;
}

export interface MutateRequestOptions<Input = never> {
	input?: Input;
	abortSignal?: AbortSignal;
	refetchMountedQueriesOnSuccess?: boolean;
}

export interface RequestOptions<Input = never, InitialState = never> {
	input?: Input;
	abortSignal?: AbortSignal;
	initialState?: InitialState;
	refetchOnWindowFocus?: boolean;
}

export type UserListener = (user: User | undefined) => void;

export interface User {
	provider: string;
	provider_id: string;
	email: string;
	email_verified: boolean;
	name: string;
	first_name: string;
	last_name: string;
	nick_name: string;
	description: string;
	user_id: string;
	avatar_url: string;
	location: string;
}

export class Client {
	constructor(baseURL?: string) {
		this.baseURL = baseURL || this.baseURL;
	}
	private readonly baseURL: string = "http://localhost:9991";
	private readonly applicationHash: string = "fc3ea720";
	private readonly applicationPath: string = "api/main";
	private readonly sdkVersion: string = "0.16.1";
	private csrfToken: string | undefined;
	private user: User | undefined;
	private userListener: UserListener | undefined;
	public setUserListener = (listener: UserListener) => {
		this.userListener = listener;
	};
	private setUser = (user: User | undefined) => {
		if (
			(user === undefined && this.user !== undefined) ||
			(user !== undefined && this.user === undefined) ||
			JSON.stringify(user) !== JSON.stringify(this.user)
		) {
			this.user = user;
			if (this.userListener !== undefined) {
				this.userListener(user);
			}
		}
	};
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
		Countries: async (options: RequestOptions) => {
			return await this.doFetch<CountriesResponse>({
				method: "GET",
				path: "Countries",
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
	public liveQuery = {
		TopProducts: (options: RequestOptions, cb: (response: Response<TopProductsResponse>) => void) => {
			return this.startSubscription<TopProductsResponse>(
				{
					method: "GET",
					path: "TopProducts",
					input: options.input,
					abortSignal: options.abortSignal,
					liveQuery: true,
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
							h: this.applicationHash,
					  })
					: "";
			if (fetchConfig.method === "POST" && this.csrfToken === undefined) {
				const res = await fetch(this.baseURL + "/" + this.applicationPath + "/auth/cookie/csrf", {
					credentials: "include",
					mode: "cors",
				});
				this.csrfToken = await res.text();
			}
			const headers: Headers = new Headers({
				Accept: "application/json",
				"WG-SDK-Version": this.sdkVersion,
			});
			if (fetchConfig.method === "POST") {
				if (this.csrfToken) {
					headers.set("X-CSRF-Token", this.csrfToken);
				}
			}
			const body = fetchConfig.method === "POST" ? JSON.stringify(fetchConfig.input) : undefined;
			const response = await fetch(
				this.baseURL + "/" + this.applicationPath + "/operations/" + fetchConfig.path + params,
				{
					headers,
					body,
					method: fetchConfig.method,
					signal: fetchConfig.abortSignal,
					credentials: "include",
					mode: "cors",
				}
			);
			if (response.status === 200) {
				const data = await response.json();
				return {
					status: "ok",
					body: data,
				};
			}
			if (response.status === 401 || response.status === 403) {
				this.csrfToken = undefined;
				this.fetchUser();
				return {
					status: "error",
					message: "unauthorized",
				};
			}
			return {
				status: "error",
				message: "internal",
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
					live: fetchConfig.liveQuery === true ? true : undefined,
				});
				const response = await fetch(
					this.baseURL + "/" + this.applicationPath + "/operations/" + fetchConfig.path + params,
					{
						headers: {
							"Content-Type": "application/json",
							"WG-SDK-Version": this.sdkVersion,
						},
						method: fetchConfig.method,
						signal: fetchConfig.abortSignal,
						credentials: "include",
						mode: "cors",
					}
				);
				if (response.status === 401) {
					this.csrfToken = undefined;
					return;
				}
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
	public fetchUser = async (abortSignal?: AbortSignal): Promise<User | undefined> => {
		const response = await fetch(this.baseURL + "/" + this.applicationPath + "/auth/cookie/user", {
			headers: {
				"Content-Type": "application/json",
				"WG-SDK-Version": this.sdkVersion,
			},
			method: "GET",
			signal: abortSignal,
			credentials: "include",
			mode: "cors",
		});
		if (response.status === 200) {
			const user = await response.json();
			this.setUser(user);
			return this.user;
		}
		this.setUser(undefined);
		return undefined;
	};
	public login = {
		github: (redirectURI?: string) => {
			this.startLogin("github", redirectURI);
		},
	};
	public logout = async (): Promise<boolean> => {
		const response = await fetch(this.baseURL + "/" + this.applicationPath + "/auth/cookie/user/logout", {
			headers: {
				"Content-Type": "application/json",
				"WG-SDK-Version": this.sdkVersion,
			},
			method: "GET",
			credentials: "include",
			mode: "cors",
		});
		this.setUser(undefined);
		return response.status === 200;
	};
	private startLogin = (providerID: string, redirectURI?: string) => {
		const query = this.queryString({
			redirect_uri: redirectURI || window.location.toString(),
		});
		window.location.replace(`${this.baseURL}/${this.applicationPath}/auth/cookie/authorize/${providerID}${query}`);
	};
}
