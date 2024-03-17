
import { StarIcon } from '@heroicons/react/20/solid'



import { Link, useParams } from "react-router-dom"
import axios from "axios"

import { useEffect, useState } from 'react'


function Product() {


  const { id } = useParams();
  console.log(id)

  const [product, setProduct] = useState({})
  //fecth product details from the server
  const url = `http://localhost:8080/api/products/product/${id}`;

  const fetchData = async () => {
    try {
      const response = await axios(url);
      setProduct(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  function deleteProduct() {
    const url = `http://localhost:8080/api/products/${id}`;
    axios.delete(url)
      .then(response => {
        
        console.log(response.data)
        alert('Product Deleted Successfully')
        window.location = '/'
      })
      .catch(error => {
        console.log(error)
      })
  }



  return (
    <div className="bg-white">
      <div className="pt-6 mt-4 ">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">

            <li className="text-sm w-screen flex flex-row justify-between items-center">
              <a href={product.href} aria-current="page" className="font-medium text-orange-700 align-middle">
                {product.productName}
              </a>

              <button 
              // onClick={deleteProduct}  
                onClick={deleteProduct}
                className='text-white bg-orange-700 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none' >
                Delete Product
              </button>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-8 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={product?.imageLink1}
              alt={""}
              className="h-full w-full object-fit object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product?.imageLink2}
                alt={""}
                className="h-full w-full object-fit object-center"
              />
            </div>
            {/* <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.images[2].src}
                alt={product.images[2].alt}
                className="h-full w-full object-fit object-center"
              />
            </div> */}
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
              src={product?.imageLink3}
              alt={""}
              className="h-full w-full object-fit object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.productName}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900 font-medium">Rs. {product.price}</p>
            <p className="text-xl mt-2 tracking-tight text-gray-900 font-medium " > Available Quantity - {product.quantity}</p>


            <Link
              to={`/updateProduct/${product.id}`}
              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-orange-700 px-8 py-3 text-base font-medium text-white hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Details
            </Link>
            {/* </form> */}
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.productDescription}</p>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product