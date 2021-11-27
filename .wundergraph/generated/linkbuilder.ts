export interface LinkDefinition {
	targetType: string;
	targetFieldName: string;
	sourceField: string;
	argumentSources: LinkFieldArgumentSourceDefinition[];
}

export interface LinkFieldArgumentSourceDefinition {
	name: string;
	type: "objectField" | "fieldArgument";
	path: string[];
}

class LinkBuilder<T, R extends {} = {}, TT = {}> {
	// @ts-ignore
	constructor(current: R = {}, sourceField: string, targetType: string, targetField: string) {
		this.current = current;
		this.sourceField = sourceField;
		this.targetType = targetType;
		this.targetField = targetField;
	}

	private readonly sourceField: string;
	private readonly targetType: string;
	private readonly targetField: string;

	// @ts-ignore
	private current: R = {};

	argument<P extends Exclude<keyof T, keyof R>, V extends T[P], S extends "fieldArgument" | "objectField">(
		key: P,
		source: S,
		value: S extends "fieldArgument" ? string : TT,
		...extraPath: string[]
	) {
		const extra: {} = { [key]: { source, path: [value, ...extraPath] } };

		const instance = {
			...(this.current as object),
			...extra,
		} as R & Pick<T, P>;

		return new LinkBuilder<T, R & Pick<T, P>, TT>(instance, this.sourceField, this.targetType, this.targetField);
	}

	build = (): LinkDefinition => {
		const args = this.current as { [key: string]: { path: string[]; source: "fieldArgument" | "objectField" } };
		return {
			argumentSources: Object.keys(args).map((key) => ({
				name: key,
				type: args[key].source,
				path: args[key].path,
			})),
			targetType: this.targetType,
			sourceField: this.sourceField,
			targetFieldName: this.targetField,
		};
	};
}

export const sourceStep = <T extends {}, R extends {}>() => ({
	source: <F extends keyof T>(field: F) => {
		return targetStep<T, F, R>(field);
	},
});

const targetStep = <T, F extends keyof T, R>(field: F) => ({
	target: <r extends keyof R>(targetType: r, targetField: string) => {
		return new LinkBuilder<T[F], {}, R[r]>({}, field as string, targetType as string, targetField);
	},
});

interface TargetTypes {
	_Service_federated: "sdl";
	Entity_federated: "findUserByID" | "findProductByUpc" | "findReviewByID";
	User_federated: "id" | "name" | "username" | "reviews";
	Review_federated: "id" | "body" | "author" | "product";
	Product_federated: "upc" | "reviews" | "name" | "price" | "weight" | "inStock" | "shippingEstimate";
	Continent_countries: "code" | "name" | "countries";
	Country_countries:
		| "code"
		| "name"
		| "native"
		| "phone"
		| "continent"
		| "capital"
		| "currency"
		| "languages"
		| "emoji"
		| "emojiU"
		| "states";
	Language_countries: "code" | "name" | "native" | "rtl";
	State_countries: "code" | "name" | "country";
	Post_jsp: "id" | "userId" | "title" | "body" | "comments";
	Comment_jsp: "id" | "name" | "email" | "body" | "postId";
	User_jsp: "id" | "name" | "username" | "email" | "address" | "phone" | "website" | "company" | "posts";
	Address_jsp: "street" | "suite" | "city" | "zipcode" | "geo";
	Geo_jsp: "lat" | "lng";
	Company_jsp: "name" | "catchPhrase" | "bs";
}

interface SourceFields {
	federated_me: {};
	federated__entities: {
		representations: null;
	};
	federated__service: {};
	federated_topProducts: {
		first: null;
	};
	countries_continents: {
		filter: null;
	};
	countries_continent: {
		code: null;
	};
	countries_countries: {
		filter: null;
	};
	countries_country: {
		code: null;
	};
	countries_languages: {
		filter: null;
	};
	countries_language: {
		code: null;
	};
	jsp_posts: {};
	jsp_postComments: {
		postID: null;
	};
	jsp_users: {};
	jsp_userPosts: {
		userID: null;
	};
}

const linkBuilder = sourceStep<SourceFields, TargetTypes>();
export default linkBuilder;
