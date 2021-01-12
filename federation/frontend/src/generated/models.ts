export interface SetPriceInput {
	upc: string;
	price: number;
}

export interface MeResponse {
	data?: {
		me?: {
			id: string;
			name?: string;
			username?: string;
		};
	};
}

export interface UpdatedPricesResponse {
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
		};
	};
}
