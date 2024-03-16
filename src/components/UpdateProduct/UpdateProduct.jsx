import { useState } from 'react'
import { useParams } from "react-router-dom"
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { storage } from '../../firebase/firebase'
import { v4 } from 'uuid'


import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function UpdateProduct() {

  let { id } = useParams()
  console.log(id)

  const [product, setProduct] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState([])
  const [images, setImages] = useState([])



  const handleImageChange = (e) => {
    const fileList = e.target.files;
    const imagesArray = [];

    for (let i = 0; i < 4; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imagesArray.push(event.target.result);
        if (imagesArray.length === fileList.length) {
          setImages(imagesArray);
        }
      };
      reader.readAsDataURL(fileList[i]);
    }
  };


  function handleSubmit(e) {
    e.preventDefault()
    console.log('form submitted')

    const metadata = {
      contentType: 'image/jpeg'
    };

    // images.forEach((image, index) => {
      const imgRef = ref(storage, `images/${v4()}`);
      const uploadTask = uploadBytesResumable(imgRef, images[0], metadata);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Error handling
          console.error('Upload error:', error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setImageUrl((prevArray) => [...prevArray, downloadURL]);
          });
        }
      );

    // })

    // const storageRef = storage().ref();
    // images.forEach((image, index) => {
    //   const uploadTask = storageRef.child(`images/${index}`).putString(image, 'data_url');

    // });


    const data = {
      product,
      manufacturer,
      quantity,
      price,
      description,
      imageUrl
    }

    console.log("Submitted Images:", images);
    console.log(data)
  }

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-orange-700 sm:text-4xl">Update Product Details</h2>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

          <div className="sm:col-span-2">
            <label htmlFor="productName" className="block text-sm font-semibold leading-6 text-gray-900">
              Product Name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="productName"
                id="productName"
                onChange={(e) => setProduct(e.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="manufacturer" className="block text-sm font-semibold leading-6 text-gray-900">
              Manufacturer
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="manufacturer"
                id="manufacturer"
                onChange={(e) => setManufacturer(e.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="qunatity" className="block text-sm font-semibold leading-6 text-gray-900">
              Quantity
            </label>
            <div className="mt-2.5">
              <input
                type="number"
                name="qunatity"
                id="quantity"
                onChange={(e) => setQuantity(e.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
              Price
            </label>
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="currency" className="sr-only">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option>USD</option>
                  <option>CAD</option>
                  <option>Rs</option>
                </select>
                <ChevronDownIcon
                  className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="number"
                name="currency"
                id="currency"
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Images */}
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold leading-6 text-gray-900">
              Images
            </label>
            <div className="mt-2.5">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold leading-6 text-gray-900">
              Description
            </label>
            <div className="mt-2.5">
              <textarea
                name="description"
                id="description"
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={''}
              />
            </div>
          </div>


        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-orange-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Render preview of selected images */}

      <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
        <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
          <img
            src={images[0]}
            // alt={product.images[0].alt}
            className="h-full w-full object-fit object-center"
          />
        </div>
        <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img
              src={images[1]}
              // alt={product.images[1].alt}
              className="h-full w-full object-fit object-center"
            />
          </div>
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img
              src={images[2]}
              // alt={product.images[2].alt}
              className="h-full w-full object-fit object-center"
            />
          </div>
        </div>
        <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
          <img
            src={images[3]}
            // alt={product.images[3].alt}
            className="h-full w-full object-fit object-center"
          />
        </div>
      </div>


    </div>
  )
}

export default UpdateProduct