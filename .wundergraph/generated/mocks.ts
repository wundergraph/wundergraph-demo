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

export interface appMockConfig {
	queries?: {
		Countries?: () => CountriesResponse | undefined;
		FakeProducts?: (input: FakeProductsInput) => FakeProductsResponse | undefined;
		OasUsers?: () => OasUsersResponse | undefined;
		TopProducts?: () => TopProductsResponse | undefined;
		Users?: () => UsersResponse | undefined;
	};
	mutations?: {
		SetPrice?: (input: SetPriceInput) => SetPriceResponse | undefined;
	};
	subscriptions?: {
		PriceUpdates?: () => PriceUpdatesResponse | undefined;
	};
}

export const appMock = (config: appMockConfig) => {
	return {
		queries: config.queries as { [name: string]: (input: Object) => Object | undefined },
		mutations: config.mutations as { [name: string]: (input: Object) => Object | undefined },
		subscriptions: config.subscriptions as {
			[name: string]: { pollingIntervalMillis: number; resolver: (input: Object) => Object | undefined };
		},
	};
};
