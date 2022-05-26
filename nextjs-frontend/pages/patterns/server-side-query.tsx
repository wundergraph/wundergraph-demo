import {useQuery, withWunderGraph} from "../../generated/nextjs";

const ServerSideQuery = () => {
    const data = useQuery.CountryWeather({
        input: {
            code: "DE",
        },
    });
    return (
        <div>
            <h1>Server-Side Query</h1>
            <p>
                This is a server-side query, it's executed on the server.
                Once rendered and re-hydrated on the client,
                it's going to be re-fetched and updated in the background.
            </p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default withWunderGraph(ServerSideQuery);