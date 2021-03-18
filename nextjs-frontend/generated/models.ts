export interface FakeProductsInput {
	first: number;
}

export interface SetPriceInput {
	upc: string;
	price: number;
}

export interface TopProductsResponse {
	data?: {
		topProducts?: {
			upc: string;
			name?: string;
			price?: number;
		}[];
	};
}

export interface FakeProductsResponse {
	data?: {
		topProducts?: {
			upc: string;
			name?: string;
			price?: number;
		}[];
	};
}

export interface OasUsersResponse {
	data?: {
		getUsers?: {
			country_code?: string;
			id?: number;
			name?: string;
		}[];
	};
}

export interface PriceUpdatesResponse {
	data?: {
		updatedPrice: {
			upc: string;
			name?: string;
			price?: number;
			reviews?: {
				id: string;
				body?: string;
			}[];
		};
	};
}

export interface SetPriceResponse {
	data?: {
		setPrice?: {
			upc: string;
			name?: string;
			price?: number;
			weight?: number;
		};
	};
}

export interface CountriesResponse {
	data?: {
		countries: {
			code: string;
			name: string;
		}[];
	};
}
