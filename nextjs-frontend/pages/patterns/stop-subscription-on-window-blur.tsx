import {useSubscription, withWunderGraph} from "../../generated/nextjs";

const StopSubscriptionOnWindowBlur = () => {
    const data = useSubscription.PriceUpdates({
        stopOnWindowBlur: true,
    });
    return (
        <div>
            <h1>Stop Subscription on Window Blur</h1>
            <p>
                This page contains a subscription that's rendered on the server and then re-hydrated on the client.
                It has "stopOnWindowBlur" set to true, so the subscription will stop when the user leaves the browser.
                If you un-focus the window, e.g. by clicking into the Chrome dev tools, the subscription will stop.
                Once you re-focus the window, the subscription will resume.
                This is also indicated by the property "streamState" which switches between "stopped" and "streaming".
            </p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}

export default withWunderGraph(StopSubscriptionOnWindowBlur);