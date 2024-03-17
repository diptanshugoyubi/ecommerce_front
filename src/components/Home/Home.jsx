import { Link } from "react-router-dom"
import axios from 'axios'
import { useEffect, useState } from "react"

import DropDown from "../Dropdown/DropDown"
import RangeSlider from "../RangeSlider/RangeSlider"



function Home() {


    //
    const [products, setProducts] = useState([])

    const [selectedManufacturer, setSelectedManufacturer] = useState("");

    //fecth product details from the server
    const url = 'http://localhost:8080/api/products';

    const fetchData = async () => {
        try {
            //fetch data from a url endpoint
            const response = await axios(url);
            setProducts(response.data)

        } catch (error) {
            //handle error
            console.log(error.response)
        }
    }

    //fetch data when the component mounts
    useEffect(() => {
        fetchData()
    }, [])


    function getProductByManufacturer(){
        console.log(selectedManufacturer)
        const url = `http://localhost:8080/api/products/manufacturer/${selectedManufacturer}`;
        axios.get(url)
            .then(response => {
                setProducts(response.data)
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }



    console.log(products)

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-14 lg:max-w-7xl lg:px-8">
                <h2 className="text-4xl font-bold tracking-tight text-orange-700">All Products</h2>

                <div className="mt-10 ml-2  mr-2 flex justify-between items-center" >
                    <DropDown setSelectedManufacturer = {setSelectedManufacturer} selectedManufacturer = {selectedManufacturer}/>
                    <RangeSlider />
                    <button 
                        className="border rounded-md px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" 
                        onClick={getProductByManufacturer}
                    >
                        Search
                    </button>
                </div>

            <hr className="mt-10"/>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products?.map((product) => (

                        <div key={product.id} className="group relative m-2">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-white border p-2 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                <img
                                    src={product?.imageLink1}
                                    alt={""}
                                    className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <Link to={`/product/${product.id}`} >
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product?.productName}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.productManufacturer}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default Home
