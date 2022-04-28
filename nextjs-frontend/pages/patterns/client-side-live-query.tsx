import {useLiveQuery, withWunderGraph} from "../../generated/wundergraph.nextjs.integration";

const ClientSideLiveQuery = () => {
    const data = useLiveQuery.CountryWeather({
        input: {
            code: "DE",
        },
        disableSSR: true,
    });
    return (
        <div>
            <h1>Client-Side Live-Query</h1>
            <p>
                This is a client-side live-query. It is not executed on the server.
                It is executed on the client.
                It renders on the server with the state "none".
                On the client, it switches the state to "loading" and then to "ok" when the data is available.
            </p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default withWunderGraph(ClientSideLiveQuery);