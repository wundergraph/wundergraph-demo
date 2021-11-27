import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { WunderGraphContext } from "./provider";
import { RequestOptions, MutateRequestOptions, SubscriptionRequestOptions, Response } from "./client";
import {
	FakeProductsInput,
	SetPriceInput,
	CountriesResponse,
	FakeProductsResponse,
	TopProductsResponse,
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
	const [_options, _setOptions] = useState<MutateRequestOptions<I> | undefined>(options);
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
		if (internalOptions.requiresAuthentication && !user) {
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
	const [_options] = useState<MutateRequestOptions<I> | undefined>(options);
	const [response, setResponse] = useState<Response<R>>({ status: "none" });
	const mutate = useCallback(
		async (options?: MutateRequestOptions<I>) => {
			if (internalOptions.requiresAuthentication && !user) {
				setResponse({ status: "requiresAuthentication" });
				return;
			}
			const combinedOptions: MutateRequestOptions<I> = {
				refetchMountedQueriesOnSuccess:
					options !== undefined && options.refetchMountedQueriesOnSuccess !== undefined
						? options.refetchMountedQueriesOnSuccess
						: _options?.refetchMountedQueriesOnSuccess,
				input: options !== undefined && options.input !== undefined ? options.input : _options?.input,
				abortSignal:
					options !== undefined && options.abortSignal !== undefined ? options.abortSignal : _options?.abortSignal,
			};
			const result = await promiseFactory(combinedOptions);
			setResponse(result);
			if (result.status === "ok" && combinedOptions.refetchMountedQueriesOnSuccess === true) {
				setRefetchMountedQueries(new Date());
			}
		},
		[user]
	);
	return {
		response,
		mutate,
	};
};

const Subscription = <R, I>(
	subscriptionFactory: (options: RequestOptions<I>, cb: (response: Response<R>) => void) => void,
	internalOptions: InternalOptions,
	options?: SubscriptionRequestOptions<I>
) => {
	const optionsJSON = JSON.stringify(options);
	const { user, initialized, refetchMountedQueries } = useWunderGraph();
	const [_options, _setOptions] = useState<RequestOptions<I> | undefined>(options);
	const [response, setResponse] = useState<Response<R>>({ status: "loading" });
	const [lastInit, setLastInit] = useState<boolean | undefined>();
	const computedInit = useMemo<boolean>(() => {
		if (lastInit === undefined) {
			setLastInit(initialized);
			return initialized;
		}
		if (options?.stopOnWindowBlur) {
			return initialized;
		}
		if (initialized) {
			setLastInit(true);
			return true;
		}
		return lastInit;
	}, [initialized, lastInit, optionsJSON]);
	useEffect(() => {
		_setOptions(options);
	}, [optionsJSON]);
	useEffect(() => {
		if (!computedInit) {
			return;
		}
		if (internalOptions.requiresAuthentication && !user) {
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
	}, [user, computedInit, _options, refetchMountedQueries]);
	return {
		response,
	};
};

export const useQuery = {
	Countries: (options?: RequestOptions<never, CountriesResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.Countries, { requiresAuthentication: false }, options);
	},
	FakeProducts: (options: RequestOptions<FakeProductsInput, FakeProductsResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.FakeProducts, { requiresAuthentication: false }, options);
	},
	TopProducts: (options?: RequestOptions<never, TopProductsResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.TopProducts, { requiresAuthentication: false }, options);
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
	PriceUpdates: (options?: SubscriptionRequestOptions) => {
		const { client } = useWunderGraph();
		return Subscription(client.subscription.PriceUpdates, { requiresAuthentication: false }, options);
	},
};

export const useLiveQuery = {
	Countries: (options?: SubscriptionRequestOptions) => {
		const { client } = useWunderGraph();
		return Subscription(client.liveQuery.Countries, { requiresAuthentication: false }, options);
	},
	FakeProducts: (options: SubscriptionRequestOptions<FakeProductsInput>) => {
		const { client } = useWunderGraph();
		return Subscription(client.liveQuery.FakeProducts, { requiresAuthentication: false }, options);
	},
	TopProducts: (options?: SubscriptionRequestOptions) => {
		const { client } = useWunderGraph();
		return Subscription(client.liveQuery.TopProducts, { requiresAuthentication: false }, options);
	},
	Users: (options?: SubscriptionRequestOptions) => {
		const { client } = useWunderGraph();
		return Subscription(client.liveQuery.Users, { requiresAuthentication: false }, options);
	},
};
