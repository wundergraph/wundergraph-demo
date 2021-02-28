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

export interface appMockConfig {
	queries?: {
		TopProducts?: () => TopProductsResponse | undefined;
		FakeProducts?: (input: FakeProductsInput) => FakeProductsResponse | undefined;
		OasUsers?: () => OasUsersResponse | undefined;
		Countries?: () => CountriesResponse | undefined;
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
