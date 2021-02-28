import {GetServerSideProps, NextPage} from 'next'
import {useMutation, useQuery, useSubscription} from "../generated/hooks";
import {FakeProductsResponse} from "../generated/models";
import {Client} from "../generated/client";

interface Props {
    products?: FakeProductsResponse;
}

const IndexPage: NextPage<Props> = ({products}) => {
    const fakeProducts = useQuery.FakeProducts({input: {first: 5}, initialState: products});
    const {mutate: setPrice, response: price} = useMutation.SetPrice({price: 0, upc: "1"});
    const priceUpdate = useSubscription.PriceUpdates();
    const oasUsers = useQuery.OasUsers();
    return (
        <div>
            <h1>
                Hello Wundergraph
            </h1>
            <h2>
                FakeProducts
            </h2>
            <p>
                {JSON.stringify(fakeProducts.response)}
            </p>
            <button onClick={()=>fakeProducts.refetch()}>refetch</button>
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
                OAS Users
            </h2>
            <p>
                {JSON.stringify(oasUsers)}
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