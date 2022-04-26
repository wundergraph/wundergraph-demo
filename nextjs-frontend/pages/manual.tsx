import {useQuery, withWunderGraph} from "../generated/wundergraph.nextjs.integration";

const Manual = () => {
    const data = useQuery.Countries();
    return (
        <div>
            <h1>Manual</h1>
            <p>
                This is the manual page.
            </p>
            <p>
                {JSON.stringify(data)}
            </p>
        </div>
    );
};

export default withWunderGraph(Manual);