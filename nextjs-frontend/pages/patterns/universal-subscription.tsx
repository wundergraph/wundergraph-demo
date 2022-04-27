import {useSubscription, withWunderGraph} from "../../generated/wundergraph.nextjs.integration";

const UniversalSubscription = () => {
    const data = useSubscription.PriceUpdates();
    return (
        <div>
            <h1>Universal Subscription</h1>
            <p>
                This subscription is first executed on the server.
                This means, the server-side-rendered page will contain the first result from the subscription.
                It's then being hydrated by the client, who starts a subscription by itself.
                This way, we get the benefits of server-side-rendering (e.g. SEO & pre-rendering) combined with the benefits of
                client-side-rendering: Keeping the user interface updated.
            </p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default withWunderGraph(UniversalSubscription);