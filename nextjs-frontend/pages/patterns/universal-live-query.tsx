import {useLiveQuery, withWunderGraph} from "../../generated/wundergraph.nextjs.integration";

const UniversalLiveQuery = () => {
    const data = useLiveQuery.CountryWeather({
        input: {
            code: "DE",
        },
    });
    return (
        <div>
            <h1>Universal Live-Query</h1>
            <p>
                This is a universal live-query.
                It's first rendered on the server, then re-hydrated on the client.
                Once the client is initalized, it'll re-subscribe to the live-query to keep the UI updated.
            </p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default withWunderGraph(UniversalLiveQuery);