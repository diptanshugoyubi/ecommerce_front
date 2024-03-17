import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { storage } from '../../firebase/firebase'
import { v4 } from 'uuid'
import axios from 'axios';



import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";



function AddNewProduct() {

  const [product, setProduct] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState([])
  const [images, setImages] = useState([])

  const [viewImages, setViewImages] = useState([])


  const [uploading, setUploading] = useState(false);


  //for viewing images
  const handleImageChange = (e) => {
    const fileList = e.target.files;
    const imagesArray = [];

    for (let i = 0; i < 3; i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imagesArray.push(event.target.result);
        if (imagesArray.length === fileList.length) {
          setViewImages(imagesArray);
        }
      };
      reader.readAsDataURL(fileList[i]);
    }
  };

  //for uploading images
  const uploadImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
  };


  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    console.log('form submitted');
  
    const metadata = {
      contentType: 'image/jpg'
    };
  
    try {
      // Start the upload process
      setUploading(true);

      // Create an array of promises for each image upload
      const uploadPromises = images.map((image) => {
        return new Promise((resolve, reject) => {
          // Create a reference to the image
          const imgRef = ref(storage, `images/${v4()}`);

          // Upload the image
          const uploadTask = uploadBytesResumable(imgRef, image, metadata);
  
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(
            'state_changed',
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
              reject(error);
            },
            async () => {
              // Upload completed successfully, now we can get the download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('File available at', downloadURL);
              setImageUrl((prevArray) => [...prevArray, downloadURL]);

              // Resolve the promise with the download URL
              resolve(downloadURL);
            }
          );
        });
      });
  
      // Wait for all the images to be uploaded
      const uploadedUrls = await Promise.all(uploadPromises);

      
  
      
      // Once all the images are uploaded, you can use the URLs to create a new product
      const data = {
        productName: product,
        quantity: quantity,
        productDescription: description,
        price: price,
        productManufacturer: manufacturer,  
        imageLinks: "", // Use the array of uploaded URLs - not in use
        imageLink1: uploadedUrls[0],
        imageLink2: uploadedUrls[1],
        imageLink3: uploadedUrls[2],
        imageLink4: "" //not in use
      };

      console.log(data);

      //URL for the server
      const URL = "http://localhost:8080/api/products"

      //send data to the server
      const response = await axios.post(URL, data);
      console.log(response.data);

    } catch (error) {
      // Handle any errors during the upload process
      console.error('Error uploading :', error);

    } finally {
      // Reset the form and state
      setProduct("");
      setManufacturer("");
      setQuantity("");
      setPrice("");
      setDescription("");
      setImageUrl([]);
      setImages([]);
      setViewImages([]);

      setUploading(false);
    }
  }
  

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      {uploading ? <div className='flex justify-end absolute top-20 right-10' ><h1 className=' font-medium bg-orange-600 rounded-md p-3 text-white ' >Uploading</h1></div> : <></>}
      
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
        <h2 className="text-3xl font-bold tracking-tight text-orange-700 sm:text-4xl">Add New Product</h2>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

          {/* Product Name */}
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
                value={product}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Manudfacturer */}
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
                value={manufacturer}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Quantity */}
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
                value={quantity}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {/* Price */}
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
                value={price}
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
                onChange={(e) => {
                  uploadImageChange(e)
                  handleImageChange(e)
                }}
              />
            </div>
          </div>

          {/* Description */}
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
                value={description}
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
            src={viewImages[0]}
            // alt={product.viewImages[0].alt}
            className="h-full w-full object-fit object-center"
          />
        </div>
        <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img
              src={viewImages[1]}
              // alt={product.viewImages[2].alt}
              className="h-full w-full object-fit object-center"
            />
          </div>
        </div>
        <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
          <img
            src={viewImages[2]}
            // alt={product.images[3].alt}
            className="h-full w-full object-fit object-center"
          />
        </div>
      </div>


    </div>
  )
}

export default AddNewProduct