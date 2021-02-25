export interface FakeProductsInput {
	first: number;
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
