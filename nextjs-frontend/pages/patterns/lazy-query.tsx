import {useQuery, withWunderGraph} from "../../generated/wundergraph.nextjs.integration";
import {useState} from "react";
import {QueryArgsWithInput} from "@wundergraph/sdk/dist/nextjs";
import {CountryWeatherInput} from "../../generated/models";

const LazyQuery = () => {
    const [args,setArgs] = useState<QueryArgsWithInput<CountryWeatherInput>>({
        input: {
            code: "DE",
        },
        lazy: true,
    });
    const data = useQuery.CountryWeather(args);
    return (
        <div>
            <h1>Lazy Query</h1>
            <p>
                This Query is lazy,
                it's not executed on the server, nor on the client.
                You first have to trigger <code>refetch(args)</code> to execute the query.
            </p>
            <p>{JSON.stringify(data)}</p>
            <button onClick={() => data.refetch(args)}>execute lazy query</button>
        </div>
    )
}

export default withWunderGraph(LazyQuery);