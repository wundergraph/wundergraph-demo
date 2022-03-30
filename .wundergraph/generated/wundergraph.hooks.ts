// Code generated by wunderctl. DO NOT EDIT.

import {
	CountriesResponse,
	CountryWeatherResponse,
	CountryWeatherInput,
	InternalCountryWeatherInput,
	InjectedCountryWeatherInput,
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
import type { WunderGraphRequestContext, Context, WunderGraphRequest, WunderGraphResponse } from "@wundergraph/sdk";

import type { User } from "./wundergraph.server";

export type AuthenticationResponse = AuthenticationOK | AuthenticationDeny;

export interface AuthenticationOK {
	status: "ok";
	user: User;
}

export interface AuthenticationDeny {
	status: "deny";
	message: string;
}

// use SKIP to skip the hook and continue the request / response chain without modifying the request / response
export type SKIP = "skip";

// use CANCEL to skip the hook and cancel the request / response chain
// this is semantically equal to throwing an error (500)
export type CANCEL = "cancel";

export type WUNDERGRAPH_OPERATION =
	| "Countries"
	| "CountryWeather"
	| "FakeProducts"
	| "PriceUpdates"
	| "SetPrice"
	| "TopProducts"
	| "Users";

export interface GlobalHooksConfig {
	httpTransport?: {
		// onRequest is called right before the request is sent
		// it can be used to modify the request
		// you can return SKIP to skip the hook and continue the request chain without modifying the request
		// you can return CANCEL to cancel the request chain and return a 500 error
		// not returning anything or undefined has the same effect as returning SKIP
		onRequest?: {
			hook: (
				ctx: WunderGraphRequestContext<User>,
				request: WunderGraphRequest
			) => Promise<WunderGraphRequest | SKIP | CANCEL | void>;
			// calling the httpTransport hooks has a case, because the custom httpTransport hooks have to be called for each request
			// for this reason, you have to explicitly enable the hook for each Operation
			enableForOperations?: WUNDERGRAPH_OPERATION[];
			// enableForAllOperations will disregard the enableForOperations property and enable the hook for all operations
			enableForAllOperations?: boolean;
		};
		// onResponse is called right after the response is received
		// it can be used to modify the response
		// you can return SKIP to skip the hook and continue the response chain without modifying the response
		// you can return CANCEL to cancel the response chain and return a 500 error
		// not returning anything or undefined has the same effect as returning SKIP
		onResponse?: {
			hook: (
				ctx: WunderGraphRequestContext<User>,
				response: WunderGraphResponse
			) => Promise<WunderGraphResponse | SKIP | CANCEL | void>;
			// calling the httpTransport hooks has a case, because the custom httpTransport hooks have to be called for each request
			// for this reason, you have to explicitly enable the hook for each Operation
			enableForOperations?: WUNDERGRAPH_OPERATION[];
			// enableForAllOperations will disregard the enableForOperations property and enable the hook for all operations
			enableForAllOperations?: boolean;
		};
	};
}

export type JSONValue = string | number | boolean | JSONObject | Array<JSONValue>;

export type JSONObject = { [key: string]: JSONValue };

export interface HooksConfig {
	global?: GlobalHooksConfig;
	authentication?: {
		postAuthentication?: (user: User) => Promise<void>;
		mutatingPostAuthentication?: (user: User) => Promise<AuthenticationResponse>;
		revalidate?: (user: User) => Promise<AuthenticationResponse>;
	};
	queries?: {
		Countries?: {
			mockResolve?: (ctx: Context<User>) => Promise<CountriesResponse>;
			preResolve?: (ctx: Context<User>) => Promise<void>;
			postResolve?: (ctx: Context<User>, response: CountriesResponse) => Promise<void>;
			customResolve?: (ctx: Context<User>) => Promise<void | CountriesResponse>;
			mutatingPostResolve?: (ctx: Context<User>, response: CountriesResponse) => Promise<CountriesResponse>;
		};
		CountryWeather?: {
			mockResolve?: (ctx: Context<User>, input: InjectedCountryWeatherInput) => Promise<CountryWeatherResponse>;
			preResolve?: (ctx: Context<User>, input: InjectedCountryWeatherInput) => Promise<void>;
			mutatingPreResolve?: (
				ctx: Context<User>,
				input: InjectedCountryWeatherInput
			) => Promise<InjectedCountryWeatherInput>;
			postResolve?: (
				ctx: Context<User>,
				input: InjectedCountryWeatherInput,
				response: CountryWeatherResponse
			) => Promise<void>;
			customResolve?: (
				ctx: Context<User>,
				input: InjectedCountryWeatherInput
			) => Promise<void | CountryWeatherResponse>;
			mutatingPostResolve?: (
				ctx: Context<User>,
				input: InjectedCountryWeatherInput,
				response: CountryWeatherResponse
			) => Promise<CountryWeatherResponse>;
		};
		FakeProducts?: {
			mockResolve?: (ctx: Context<User>, input: InjectedFakeProductsInput) => Promise<FakeProductsResponse>;
			preResolve?: (ctx: Context<User>, input: InjectedFakeProductsInput) => Promise<void>;
			mutatingPreResolve?: (ctx: Context<User>, input: InjectedFakeProductsInput) => Promise<InjectedFakeProductsInput>;
			postResolve?: (
				ctx: Context<User>,
				input: InjectedFakeProductsInput,
				response: FakeProductsResponse
			) => Promise<void>;
			customResolve?: (ctx: Context<User>, input: InjectedFakeProductsInput) => Promise<void | FakeProductsResponse>;
			mutatingPostResolve?: (
				ctx: Context<User>,
				input: InjectedFakeProductsInput,
				response: FakeProductsResponse
			) => Promise<FakeProductsResponse>;
		};
		TopProducts?: {
			mockResolve?: (ctx: Context<User>) => Promise<TopProductsResponse>;
			preResolve?: (ctx: Context<User>) => Promise<void>;
			postResolve?: (ctx: Context<User>, response: TopProductsResponse) => Promise<void>;
			customResolve?: (ctx: Context<User>) => Promise<void | TopProductsResponse>;
			mutatingPostResolve?: (ctx: Context<User>, response: TopProductsResponse) => Promise<TopProductsResponse>;
		};
		Users?: {
			mockResolve?: (ctx: Context<User>) => Promise<UsersResponse>;
			preResolve?: (ctx: Context<User>) => Promise<void>;
			postResolve?: (ctx: Context<User>, response: UsersResponse) => Promise<void>;
			customResolve?: (ctx: Context<User>) => Promise<void | UsersResponse>;
			mutatingPostResolve?: (ctx: Context<User>, response: UsersResponse) => Promise<UsersResponse>;
		};
	};
	mutations?: {
		SetPrice?: {
			mockResolve?: (ctx: Context<User>, input: InjectedSetPriceInput) => Promise<SetPriceResponse>;
			preResolve?: (ctx: Context<User>, input: InjectedSetPriceInput) => Promise<void>;
			mutatingPreResolve?: (ctx: Context<User>, input: InjectedSetPriceInput) => Promise<InjectedSetPriceInput>;
			postResolve?: (ctx: Context<User>, input: InjectedSetPriceInput, response: SetPriceResponse) => Promise<void>;
			mutatingPostResolve?: (
				ctx: Context<User>,
				input: InjectedSetPriceInput,
				response: SetPriceResponse
			) => Promise<SetPriceResponse>;
		};
	};
}
