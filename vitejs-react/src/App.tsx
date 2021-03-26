import React from 'react'
import './App.css'
import {useLiveQuery, useQuery, useSubscription} from './generated/hooks'

function App() {
    const updates = useSubscription.PriceUpdates();
    const topProducts = useQuery.TopProducts();
    const fakeProducts = useQuery.FakeProducts({input: {first: 10}});
    const {response: liveProducts} = useLiveQuery.TopProducts();
    return (
        <div className="App">
            <h2>TopProducts</h2>
            <p>
                {JSON.stringify(topProducts)}
            </p>
            <h2>
                Products LiveQuery
            </h2>
            <p>
                {JSON.stringify(liveProducts)}
            </p>
            <h2>FakeProducts</h2>
            <p>
                {JSON.stringify(fakeProducts)}
            </p>
            <h2>Product Updates</h2>
            <p>
                {JSON.stringify(updates)}
            </p>
        </div>
    )
}

export default App
