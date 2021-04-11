export interface FakeProductsInput {
	first: number;
}

export interface SetPriceInput {
	upc: string;
	price: number;
}

export interface GraphQLError {
	message: string;
	path?: ReadonlyArray<string | number>;
}

export interface TopProductsResponse {
	data?: {
		topProducts?: {
			upc: string;
			name?: string;
			price?: number;
		}[];
	};
	errors?: ReadonlyArray<GraphQLError>;
}

export interface FakeProductsResponse {
	data?: {
		topProducts?: {
			upc: string;
			name?: string;
			price?: number;
		}[];
	};
	errors?: ReadonlyArray<GraphQLError>;
}

export interface OasUsersResponse {
	data?: {
		getUsers?: {
			country_code?: string;
			id?: number;
			name?: string;
		}[];
	};
	errors?: ReadonlyArray<GraphQLError>;
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
	errors?: ReadonlyArray<GraphQLError>;
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
	errors?: ReadonlyArray<GraphQLError>;
}

export interface CountriesResponse {
	data?: {
		countries: {
			code: string;
			name: string;
		}[];
	};
	errors?: ReadonlyArray<GraphQLError>;
}

export interface UsersResponse {
	data?: {
		users?: {
			id?: number;
			name?: string;
			website?: string;
			posts?: {
				id?: number;
				title?: string;
				comments?: {
					id?: number;
					name?: string;
					body?: string;
				}[];
			}[];
		}[];
	};
	errors?: ReadonlyArray<GraphQLError>;
}
