// Code generated by wunderctl. DO NOT EDIT.

import type {
	AllPricesResponse,
	AllPricesResponseData,
	CountriesResponse,
	CountriesResponseData,
	CountryWeatherResponse,
	CountryWeatherInput,
	CountryWeatherResponseData,
	FakeProductsResponse,
	FakeProductsInput,
	FakeProductsResponseData,
	PriceUpdatesResponse,
	PriceUpdatesResponseData,
	ProtectedSetPriceResponse,
	ProtectedSetPriceInput,
	ProtectedSetPriceResponseData,
	ProtectedWeatherResponse,
	ProtectedWeatherInput,
	ProtectedWeatherResponseData,
	SetPriceResponse,
	SetPriceInput,
	SetPriceResponseData,
	TopProductsResponse,
	TopProductsResponseData,
	UsersResponse,
	UsersResponseData,
} from "./models";
import { createContext } from "react";
import {
	QueryArgsWithInput,
	SubscriptionArgs,
	SubscriptionArgsWithInput,
	hooks,
	WunderGraphContextProperties,
	Client,
	User,
} from "@wundergraph/sdk/dist/nextjs";

export type Role = "admin" | "user";

export enum AuthProvider {
	"github" = "github",
}

export const AuthProviders = {
	github: AuthProvider.github,
};

const defaultWunderGraphContextProperties: WunderGraphContextProperties<Role> = {
	ssrCache: {},
	client: new Client({
		applicationHash: "57bbef48",
		applicationPath: "api/main",
		baseURL: "http://localhost:9991",
		sdkVersion: "1.0.0-next.25",
	}),
	user: null,
	setUser: (value) => {},
	isWindowFocused: "pristine",
	setIsWindowFocused: (value) => {},
	refetchMountedOperations: 0,
	setRefetchMountedOperations: (value) => {},
};

export const WunderGraphContext = createContext<WunderGraphContextProperties<Role>>(
	defaultWunderGraphContextProperties
);

export const withWunderGraph = hooks.withWunderGraphContextWrapper(
	WunderGraphContext,
	defaultWunderGraphContextProperties
);

export const useWunderGraph = hooks.useWunderGraph(WunderGraphContext);

export const useQuery = {
	CountryWeather: (args: QueryArgsWithInput<CountryWeatherInput>) =>
		hooks.useQueryWithInput<CountryWeatherInput, CountryWeatherResponseData, Role>(WunderGraphContext, {
			operationName: "CountryWeather",
			requiresAuthentication: false,
		})(args),
	FakeProducts: (args: QueryArgsWithInput<FakeProductsInput>) =>
		hooks.useQueryWithInput<FakeProductsInput, FakeProductsResponseData, Role>(WunderGraphContext, {
			operationName: "FakeProducts",
			requiresAuthentication: false,
		})(args),
	ProtectedWeather: (args: QueryArgsWithInput<ProtectedWeatherInput>) =>
		hooks.useQueryWithInput<ProtectedWeatherInput, ProtectedWeatherResponseData, Role>(WunderGraphContext, {
			operationName: "ProtectedWeather",
			requiresAuthentication: true,
		})(args),
	AllPrices: hooks.useQueryWithoutInput<AllPricesResponseData, Role>(WunderGraphContext, {
		operationName: "AllPrices",
		requiresAuthentication: false,
	}),
	Countries: hooks.useQueryWithoutInput<CountriesResponseData, Role>(WunderGraphContext, {
		operationName: "Countries",
		requiresAuthentication: false,
	}),
	TopProducts: hooks.useQueryWithoutInput<TopProductsResponseData, Role>(WunderGraphContext, {
		operationName: "TopProducts",
		requiresAuthentication: false,
	}),
	Users: hooks.useQueryWithoutInput<UsersResponseData, Role>(WunderGraphContext, {
		operationName: "Users",
		requiresAuthentication: false,
	}),
};

export const useMutation = {
	ProtectedSetPrice: () =>
		hooks.useMutationWithInput<ProtectedSetPriceInput, ProtectedSetPriceResponseData, Role>(WunderGraphContext, {
			operationName: "ProtectedSetPrice",
			requiresAuthentication: true,
		}),
	SetPrice: () =>
		hooks.useMutationWithInput<SetPriceInput, SetPriceResponseData, Role>(WunderGraphContext, {
			operationName: "SetPrice",
			requiresAuthentication: false,
		}),
};

export const useSubscription = {
	PriceUpdates: (args?: SubscriptionArgs) =>
		hooks.useSubscriptionWithoutInput<PriceUpdatesResponseData, Role>(WunderGraphContext, {
			operationName: "PriceUpdates",
			isLiveQuery: false,
			requiresAuthentication: false,
		})(args),
};

export const useLiveQuery = {
	CountryWeather: (args: SubscriptionArgsWithInput<CountryWeatherInput>) =>
		hooks.useSubscriptionWithInput<CountryWeatherInput, CountryWeatherResponseData, Role>(WunderGraphContext, {
			operationName: "CountryWeather",
			isLiveQuery: true,
			requiresAuthentication: false,
		})(args),
	FakeProducts: (args: SubscriptionArgsWithInput<FakeProductsInput>) =>
		hooks.useSubscriptionWithInput<FakeProductsInput, FakeProductsResponseData, Role>(WunderGraphContext, {
			operationName: "FakeProducts",
			isLiveQuery: true,
			requiresAuthentication: false,
		})(args),
	ProtectedWeather: (args: SubscriptionArgsWithInput<ProtectedWeatherInput>) =>
		hooks.useSubscriptionWithInput<ProtectedWeatherInput, ProtectedWeatherResponseData, Role>(WunderGraphContext, {
			operationName: "ProtectedWeather",
			isLiveQuery: true,
			requiresAuthentication: true,
		})(args),
	AllPrices: (args?: SubscriptionArgs) =>
		hooks.useSubscriptionWithoutInput<AllPricesResponseData, Role>(WunderGraphContext, {
			operationName: "AllPrices",
			isLiveQuery: true,
			requiresAuthentication: false,
		})(args),
	Countries: (args?: SubscriptionArgs) =>
		hooks.useSubscriptionWithoutInput<CountriesResponseData, Role>(WunderGraphContext, {
			operationName: "Countries",
			isLiveQuery: true,
			requiresAuthentication: false,
		})(args),
	TopProducts: (args?: SubscriptionArgs) =>
		hooks.useSubscriptionWithoutInput<TopProductsResponseData, Role>(WunderGraphContext, {
			operationName: "TopProducts",
			isLiveQuery: true,
			requiresAuthentication: false,
		})(args),
	Users: (args?: SubscriptionArgs) =>
		hooks.useSubscriptionWithoutInput<UsersResponseData, Role>(WunderGraphContext, {
			operationName: "Users",
			isLiveQuery: true,
			requiresAuthentication: false,
		})(args),
};
