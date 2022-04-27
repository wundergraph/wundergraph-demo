import {useQuery, useSubscription, withWunderGraph} from "../../generated/wundergraph.nextjs.integration";

const ClientSideSubscription = () => {
    const data = useSubscription.PriceUpdates({
        disableSSR: true,
    });
    return (
        <div>
            <h1>Client-Side Subscription</h1>
            <p>
                This page contains a client-side subscription.
                It's rendered by the server in the state "non".
                Once the client is re-hydrated, the subscription is started.
            </p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default withWunderGraph(ClientSideSubscription);