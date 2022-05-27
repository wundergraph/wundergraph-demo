import {NextPage} from 'next'
import {
    AuthProviders,
    useLiveQuery,
    useMutation,
    useQuery,
    useSubscription,
    useWunderGraph,
    withWunderGraph
} from "../generated/nextjs";

const IndexPage: NextPage = () => {
    const {login, logout, user} = useWunderGraph();
    const fakeProducts = useQuery.FakeProducts({input: {first: 5}});
    const {mutate: setPrice, result: price} = useMutation.SetPrice();
    const priceUpdate = useSubscription.PriceUpdates();
    const countries = useQuery.Countries();
    const {result: liveProducts} = useLiveQuery.TopProducts();
    const users = useQuery.Users();
    return (
        <div>
            <h1>
                Hello WunderGraph
            </h1>
            <h2>
                User
            </h2>
            <p>
                {user === null && "user not logged in!"}
                {user !== null && `name: ${user.name}, email: ${user.email}`}
            </p>
            <p>
                {user === null && <button onClick={() => login(AuthProviders.github)}>login</button>}
                {user !== null && <button onClick={() => logout()}>logout</button>}
            </p>
            <h2>
                FakeProducts
            </h2>
            <p>
                {JSON.stringify(fakeProducts.result)}
            </p>
            <button onClick={() => fakeProducts.refetch({input: {first: 5}})}>refetch</button>
            <h2>
                Set Price
            </h2>
            <button onClick={() => {
                setPrice({input: {upc: "2", price: randomInt(100)}})
            }}>Set
            </button>
            <p>
                {JSON.stringify(price)}
            </p>
            <h2>
                Price Updates
            </h2>
            <p>
                {JSON.stringify(priceUpdate)}
            </p>
            <h2>
                Products LiveQuery
            </h2>
            <p>
                {JSON.stringify(liveProducts)}
            </p>
            <h2>
                Countries
            </h2>
            <p>
                {JSON.stringify(countries)}
            </p>
            <h2>
                JSON Placeholder Users
            </h2>
            <p>
                {JSON.stringify(users)}
            </p>
        </div>
    )
}

const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max)) + 1

export default withWunderGraph(IndexPage, {
    baseURL: process.env.NEXT_PUBLIC_WG_BASE_URL,
});