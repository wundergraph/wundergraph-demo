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
	User: "id" | "name" | "username" | "reviews";
	Review: "id" | "body" | "author" | "product";
	Product: "upc" | "reviews" | "name" | "price" | "weight" | "inStock" | "shippingEstimate";
	OasUser: "id" | "name" | "country_code";
	Continent: "code" | "name" | "countries";
	Country:
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
	Language: "code" | "name" | "native" | "rtl";
	State: "code" | "name" | "country";
	Post: "id" | "userId" | "title" | "body" | "comments";
	Comment: "id" | "name" | "email" | "body" | "postId";
	JSP_User: "id" | "name" | "username" | "email" | "address" | "phone" | "website" | "company" | "posts";
	Address: "street" | "suite" | "city" | "zipcode" | "geo";
	Geo: "lat" | "lng";
	Company: "name" | "catchPhrase" | "bs";
}

interface SourceFields {
	me: {};
	topProducts: {
		first: null;
	};
	getUsers: {};
	getUsersUserId: {
		user_id: null;
	};
	continents: {
		filter: null;
	};
	continent: {
		code: null;
	};
	countries: {
		filter: null;
	};
	country: {
		code: null;
	};
	languages: {
		filter: null;
	};
	language: {
		code: null;
	};
	posts: {};
	postComments: {
		postID: null;
	};
	users: {};
	userPosts: {
		userID: null;
	};
}

const linkBuilder = sourceStep<SourceFields, TargetTypes>();
export default linkBuilder;
