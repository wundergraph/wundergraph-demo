import { useCallback, useContext, useEffect, useState } from "react";
import { WunderGraphContext } from "./provider";
import { RequestOptions, MutateRequestOptions, Response } from "./client";
import {
	FakeProductsInput,
	SetPriceInput,
	TopProductsResponse,
	FakeProductsResponse,
	OasUsersResponse,
	CountriesResponse,
	UsersResponse,
} from "./models";

export const useWunderGraph = () => {
	const ctx = useContext(WunderGraphContext);
	if (ctx === undefined) {
		throw new Error("WunderGraphContext missing, make sure to put WunderGraphProvider at the root of your app");
	}
	return {
		client: ctx.client,
		user: ctx.user,
		initialized: ctx.initialized,
		initializing: ctx.initializing,
		onWindowFocus: ctx.onWindowFocus,
		onWindowBlur: ctx.onWindowBlur,
		refetchMountedQueries: ctx.refetchMountedQueries,
		setRefetchMountedQueries: ctx.setRefetchMountedQueries,
		queryCache: ctx.queryCache,
	};
};

interface InternalOptions {
	requiresAuthentication: boolean;
}

const Query = <R extends {}, I extends {}>(
	promiseFactory: (options: RequestOptions<I, R>) => Promise<Response<R>>,
	internalOptions: InternalOptions,
	options?: RequestOptions<I, R>
) => {
	const { user, initialized, onWindowFocus, refetchMountedQueries, queryCache } = useWunderGraph();
	const [_options, _setOptions] = useState<MutateRequestOptions<I>>(options);
	const [shouldFetch, setShouldFetch] = useState<boolean>(options === undefined || options.initialState === undefined);
	const refetch = useCallback((options?: RequestOptions<I, R>) => {
		if (options !== undefined) {
			_setOptions(options);
		}
		setShouldFetch(true);
	}, []);
	useEffect(() => {
		if (options && options.refetchOnWindowFocus === true) {
			setShouldFetch(true);
		}
	}, [onWindowFocus]);
	const [response, setResponse] = useState<Response<R>>(
		options !== undefined && options.initialState !== undefined
			? {
					status: "ok",
					body: options.initialState,
			  }
			: { status: "loading" }
	);
	useEffect(() => {
		if (!initialized) {
			return;
		}
		if (internalOptions.requiresAuthentication && user === undefined) {
			setResponse({ status: "requiresAuthentication" });
			return;
		}
		if (!shouldFetch) {
			return;
		}
		const abortController = new AbortController();
		if (response.status === "ok") {
			setResponse({ status: "ok", refetching: true, body: response.body });
		}
		const cacheKey = JSON.stringify(_options);
		const cached = queryCache[cacheKey];
		if (response.status !== "ok" && cached) {
			setResponse({
				status: "cached",
				body: cached as R,
			});
		}
		(async () => {
			const result = await promiseFactory({
				..._options,
				abortSignal: abortController.signal,
			});
			if (abortController.signal.aborted) {
				setResponse({ status: "aborted" });
				return;
			}
			if (result.status === "ok") {
				queryCache[cacheKey] = result.body;
			}
			setResponse(result);
			setShouldFetch(false);
		})();
		return () => {
			abortController.abort();
		};
	}, [user, initialized, shouldFetch, _options, promiseFactory]);
	useEffect(() => setShouldFetch(true), [user, refetchMountedQueries]);
	return {
		response,
		refetch,
	};
};

const Mutation = <R extends {}, I extends {}>(
	promiseFactory: (options: RequestOptions<I, R>) => Promise<Response<R>>,
	internalOptions: InternalOptions,
	options?: MutateRequestOptions<I>
) => {
	const { user, setRefetchMountedQueries } = useWunderGraph();
	const [_options, _setOptions] = useState<MutateRequestOptions<I>>(options);
	const [response, setResponse] = useState<Response<R>>({ status: "none" });
	const [once, setOnce] = useState(false);
	const mutate = useCallback((options?: MutateRequestOptions<I>) => {
		_setOptions((prev) => ({
			refetchMountedQueriesOnSuccess:
				options.refetchMountedQueriesOnSuccess !== undefined
					? options.refetchMountedQueriesOnSuccess
					: prev.refetchMountedQueriesOnSuccess,
			input: options.input !== undefined ? options.input : prev.input,
			abortSignal: options.abortSignal !== undefined ? options.abortSignal : prev.abortSignal,
		}));
		if (!once) {
			setOnce(true);
		}
	}, []);
	useEffect(() => {
		if (!once) {
			return;
		}
		if (internalOptions.requiresAuthentication && user === undefined) {
			setResponse({ status: "requiresAuthentication" });
			return;
		}
		const abortController = new AbortController();
		(async () => {
			setResponse({ status: "loading" });
			const result = await promiseFactory({
				..._options,
				abortSignal: abortController.signal,
			});
			if (abortController.signal.aborted) {
				setResponse({ status: "aborted" });
				return;
			}
			setResponse(result);
			if (result.status === "ok" && _options && _options.refetchMountedQueriesOnSuccess === true) {
				setRefetchMountedQueries(new Date());
			}
		})();
		return () => {
			abortController.abort();
		};
	}, [user, once, _options, promiseFactory]);
	return {
		response,
		mutate,
	};
};

const Subscription = <R, I>(
	subscriptionFactory: (options: RequestOptions<I>, cb: (response: Response<R>) => void) => void,
	internalOptions: InternalOptions,
	options?: RequestOptions<I>
) => {
	const { user, initialized } = useWunderGraph();
	const [_options, _setOptions] = useState<RequestOptions<I> | undefined>(options);
	const [response, setResponse] = useState<Response<R>>({ status: "loading" });
	const [key, setKey] = useState<string>("");
	useEffect(() => {
		const nextKey = JSON.stringify(options);
		if (nextKey === key) {
			return;
		}
		setKey(nextKey);
		_setOptions(options);
	}, [options]);
	useEffect(() => {
		if (!initialized) {
			return;
		}
		if (internalOptions.requiresAuthentication && user === undefined) {
			setResponse({ status: "requiresAuthentication" });
			return;
		}
		const controller = new AbortController();
		subscriptionFactory(
			{
				..._options,
				abortSignal: controller.signal,
			},
			(res) => {
				if (!controller.signal.aborted) setResponse(res);
			}
		);
		return () => {
			controller.abort();
		};
	}, [user, initialized, _options]);
	return {
		response,
	};
};

export const useQuery = {
	TopProducts: (options?: RequestOptions<never, TopProductsResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.TopProducts, { requiresAuthentication: true }, options);
	},
	FakeProducts: (options: RequestOptions<FakeProductsInput, FakeProductsResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.FakeProducts, { requiresAuthentication: false }, options);
	},
	OasUsers: (options?: RequestOptions<never, OasUsersResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.OasUsers, { requiresAuthentication: true }, options);
	},
	Countries: (options?: RequestOptions<never, CountriesResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.Countries, { requiresAuthentication: false }, options);
	},
	Users: (options?: RequestOptions<never, UsersResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.Users, { requiresAuthentication: false }, options);
	},
};

export const useMutation = {
	SetPrice: (options: MutateRequestOptions<SetPriceInput>) => {
		const { client } = useWunderGraph();
		return Mutation(client.mutation.SetPrice, { requiresAuthentication: false }, options);
	},
};

export const useSubscription = {
	PriceUpdates: () => {
		const { client } = useWunderGraph();
		return Subscription(client.subscription.PriceUpdates, { requiresAuthentication: false });
	},
};

export const useLiveQuery = {
	TopProducts: () => {
		const { client } = useWunderGraph();
		return Subscription(client.liveQuery.TopProducts, { requiresAuthentication: true });
	},
};
