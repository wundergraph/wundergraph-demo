export interface FakeProductsInput {
	first: number;
}

export interface SetPriceInput {
	upc: string;
	price: number;
}

export interface InternalFakeProductsInput {
	first: number;
}

export interface InternalSetPriceInput {
	upc: string;
	price: number;
}

export interface InjectedFakeProductsInput {
	first: number;
}

export interface InjectedSetPriceInput {
	upc: string;
	price: number;
}

export interface GraphQLError {
	message: string;
	path?: ReadonlyArray<string | number>;
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

export interface PriceUpdatesResponse {
	data?: {
		updatedPrice: {
			upc: string;
			name?: string;
			price?: number;
			reviews?: {
				id: string;
				body?: string;
				author?: {
					id: string;
					name?: string;
				};
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

export interface TopProductsResponse {
	data?: {
		topProducts?: {
			upc: string;
			name?: string;
			price?: number;
			reviews?: {
				id: string;
				body?: string;
				author?: {
					id: string;
					name?: string;
					username?: string;
				};
			}[];
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
		}[];
	};
	errors?: ReadonlyArray<GraphQLError>;
}

export interface GraphQLError {
	message: string;
	path?: ReadonlyArray<string | number>;
}

export interface CountriesResponseData {
	countries: {
		code: string;
		name: string;
	}[];
}

export interface FakeProductsResponseData {
	topProducts?: {
		upc: string;
		name?: string;
		price?: number;
	}[];
}

export interface PriceUpdatesResponseData {
	updatedPrice: {
		upc: string;
		name?: string;
		price?: number;
		reviews?: {
			id: string;
			body?: string;
			author?: {
				id: string;
				name?: string;
			};
		}[];
	};
}

export interface SetPriceResponseData {
	setPrice?: {
		upc: string;
		name?: string;
		price?: number;
		weight?: number;
	};
}

export interface TopProductsResponseData {
	topProducts?: {
		upc: string;
		name?: string;
		price?: number;
		reviews?: {
			id: string;
			body?: string;
			author?: {
				id: string;
				name?: string;
				username?: string;
			};
		}[];
	}[];
}

export interface UsersResponseData {
	users?: {
		id?: number;
		name?: string;
		website?: string;
	}[];
}
