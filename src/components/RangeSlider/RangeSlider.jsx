import { useState } from 'react'

function RangeSlider() {

    const [price, setPrice] = useState(500);

    return (
        <div className="w-full max-w-lg">
            
                <input
                    type="range"
                    id="price-range"
                    className="w-full accent-orange-600"
                    min={0}
                    max={200000}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            
            <div className="flex justify-between text-gray-500">
                <span id="minPrice">Rs. {price}</span>
                <span id="maxPrice">Rs. 200000</span>
            </div>
        </div>
    )
}

export default RangeSlider