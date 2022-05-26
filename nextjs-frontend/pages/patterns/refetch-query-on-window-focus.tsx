import {useQuery, withWunderGraph} from "../../generated/nextjs";

const RefetchQueryOnWindowFocus = () => {
    const data = useQuery.CountryWeather({
        input: {
            code: "DE",
        },
        disableSSR: true,
        refetchOnWindowFocus: true,
    });
    return (
        <div>
            <h1>Refetch Query On Window Focus</h1>
            <p>
                This is a client-side query. It is not executed on the server.
                When you blur the window and come back (focus again),
                the query is being re-fetched.
                Depending on how often you do this, you might actually see the temperature change.
            </p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default withWunderGraph(RefetchQueryOnWindowFocus);