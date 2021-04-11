import {GetServerSideProps, NextPage} from 'next'
import {useLiveQuery, useMutation, useQuery, useSubscription, useWunderGraph} from "../generated/hooks";
import {FakeProductsResponse} from "../generated/models";
import {Client} from "../generated/client";

interface Props {
    products?: FakeProductsResponse;
}

const IndexPage: NextPage<Props> = ({products}) => {
    const {client: {login, logout}, user} = useWunderGraph();
    const fakeProducts = useQuery.FakeProducts({input: {first: 5}, initialState: products});
    const {mutate: setPrice, response: price} = useMutation.SetPrice({input: {price: 0, upc: "1"}});
    const priceUpdate = useSubscription.PriceUpdates();
    const oasUsers = useQuery.OasUsers({refetchOnWindowFocus: true});
    const countries = useQuery.Countries();
    const {response: liveProducts} = useLiveQuery.TopProducts();
    const users = useQuery.Users();
    return (
        <div>
            <h1>
                Hello Wundergraph
            </h1>
            <h2>
                User
            </h2>
            <p>
                {user === undefined && "user not logged in!"}
                {user !== undefined && `name: ${user.name}, email: ${user.email}`}
            </p>
            <p>
                {user === undefined && <button onClick={() => login.github()}>login</button>}
                {user !== undefined && <button onClick={() => logout()}>logout</button>}
            </p>
            <h2>
                FakeProducts
            </h2>
            <p>
                {JSON.stringify(fakeProducts.response)}
            </p>
            <button onClick={() => fakeProducts.refetch()}>refetch</button>
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
                OAS Users
            </h2>
            <p>
                {JSON.stringify(oasUsers)}
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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const client = new Client();
    const products = await client.query.FakeProducts({input: {first: 5}});
    return {
        props: {
            products: products.status === "ok" ? products.body : null,
        }
    }
}

const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max)) + 1

export default IndexPage;