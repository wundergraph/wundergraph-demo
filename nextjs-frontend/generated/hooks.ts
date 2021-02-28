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
} from "./models";

export const useWunderGraph = () => {
	const ctx = useContext(WunderGraphContext);
	if (ctx === undefined) {
		throw new Error("WunderGraphContext missing, make sure to put WunderGraphProvider at the root of your app");
	}
	return {
		client: ctx.client,
	};
};

const Query = <R extends {}, I extends {}>(
	promiseFactory: (options: RequestOptions<I, R>) => Promise<Response<R>>,
	options?: RequestOptions<I, R>
) => {
	const [_options, _setOptions] = useState<MutateRequestOptions<I>>(options);
	const [shouldFetch, setShouldFetch] = useState<boolean>(options === undefined || options.initialState === undefined);
	const refetch = useCallback((options?: RequestOptions<I, R>) => {
		if (options !== undefined) {
			_setOptions(options);
		}
		setShouldFetch(true);
	}, []);
	const [response, setResponse] = useState<Response<R>>(
		options !== undefined && options.initialState !== undefined
			? {
					status: "ok",
					body: options.initialState,
			  }
			: { status: "loading" }
	);
	useEffect(() => {
		if (!shouldFetch) {
			return;
		}
		const abortController = new AbortController();
		if (response.status === "ok") {
			setResponse({ status: "ok", refetching: true, body: response.body });
		}
		(async () => {
			const result = await promiseFactory({
				..._options,
				abortSignal: abortController.signal,
			});
			setShouldFetch(false);
			if (abortController.signal.aborted) {
				setResponse({ status: "aborted" });
				return;
			}
			setResponse(result);
		})();
		return () => {
			abortController.abort();
		};
	}, [shouldFetch, _options, promiseFactory]);
	return {
		response,
		refetch,
	};
};

const Mutation = <R extends {}, I extends {}>(
	promiseFactory: (options: RequestOptions<I, R>) => Promise<Response<R>>,
	options?: MutateRequestOptions<I>
) => {
	const [_options, _setOptions] = useState<MutateRequestOptions<I>>(options);
	const [response, setResponse] = useState<Response<R>>({ status: "none" });
	const [once, setOnce] = useState(false);
	const mutate = useCallback((options?: MutateRequestOptions<I>) => {
		_setOptions(options);
		if (!once) {
			setOnce(true);
		}
	}, []);
	useEffect(() => {
		if (!once) {
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
		})();
		return () => {
			abortController.abort();
		};
	}, [once, _options, promiseFactory]);
	return {
		response,
		mutate,
	};
};

const Subscription = <R, I>(
	subscriptionFactory: (options: RequestOptions<I>, cb: (response: Response<R>) => void) => void,
	options?: RequestOptions<I>
) => {
	const [_options, _setOptions] = useState<MutateRequestOptions<I>>(options);
	const [response, setResponse] = useState<Response<R>>({ status: "loading" });
	useEffect(() => {
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
	}, [_options]);
	return {
		response,
	};
};

export const useQuery = {
	TopProducts: (options?: RequestOptions<never, TopProductsResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.TopProducts, options);
	},
	FakeProducts: (options: RequestOptions<FakeProductsInput, FakeProductsResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.FakeProducts, options);
	},
	OasUsers: (options?: RequestOptions<never, OasUsersResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.OasUsers, options);
	},
	Countries: (options?: RequestOptions<never, CountriesResponse>) => {
		const { client } = useWunderGraph();
		return Query(client.query.Countries, options);
	},
};

export const useMutation = {
	SetPrice: (input: SetPriceInput) => {
		const { client } = useWunderGraph();
		return Mutation(client.mutation.SetPrice, { input });
	},
};

export const useSubscription = {
	PriceUpdates: () => {
		const { client } = useWunderGraph();
		return Subscription(client.subscription.PriceUpdates);
	},
};
