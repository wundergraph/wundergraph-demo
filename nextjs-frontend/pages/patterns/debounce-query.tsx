import {useQuery, withWunderGraph} from "../../generated/nextjs";
import {useState} from "react";
import {QueryArgsWithInput} from "@wundergraph/sdk/dist/nextjs";
import {CountryWeatherInput} from "../../generated/models";

const DebounceQuery = () => {
    const [args,setArgs] = useState<QueryArgsWithInput<CountryWeatherInput>>({
        input: {
            code: "DE",
        },
        debounceMillis: 500,
    });
    const data = useQuery.CountryWeather(args);
    return (
        <div>
            <h1>Debounce Query</h1>
            <p>
                This query is debounced by 500ms.
                This means, it will only be executed after 500ms of inactivity.
                If you change the input, e.g. to "US", the query will wait 500ms and then execute.
                This removes a lot of unnecessary requests while a user is typing.
            </p>
            <p>{JSON.stringify(data)}</p>
            <input placeholder="Country Code" value={args.input.code} onChange={e => setArgs(prev => ({...prev,input: {...prev.input,code: e.target.value}}))}/>
        </div>
    )
}

export default withWunderGraph(DebounceQuery);