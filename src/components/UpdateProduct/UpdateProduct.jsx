import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { storage } from '../../firebase/firebase'
import { v4 } from 'uuid'

import axios from 'axios'


import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function UpdateProduct(props) {

  let { id } = useParams()
  console.log(id)

  const [product, setProduct] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState([])
  const [images, setImages] = useState([])

  //for viewing images
  const [viewImages, setViewImages] = useState([])

  //uploading status
  const [uploading, setUploading] = useState(false);




  //for viewing images
  const handleImageChange = (e) => {
    const fileList = e.target.files;
    const imagesArray = [];

    for (let i = 0; i < 4; i++) {
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


      setUploading(true);


      const uploadPromises = images.map((image) => {
        return new Promise((resolve, reject) => {
          const imgRef = ref(storage, `images/${v4()}`);
          
          const uploadTask = uploadBytesResumable(imgRef, image, metadata);

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
              resolve(downloadURL);
            }
          );
        });
      });

      let uploadedUrls;
      uploadedUrls = await Promise.all(uploadPromises); 

      //get the image links
      let imageLink1 = uploadedUrls.length !==0 ? uploadedUrls[0] : viewImages[0]; 
      let imageLink2 = uploadedUrls.length !==0 ? uploadedUrls[1] : viewImages[1];
      let imageLink3 = uploadedUrls.length !==0 ? uploadedUrls[2] : viewImages[2];

      const data = {
        productName: product,
        quantity: quantity,
        productDescription: description,
        price: price,
        productManufacturer: manufacturer,
        imageLinks: "", // Use the array of uploaded URLs - not in use
        imageLink1: imageLink1,
        imageLink2: imageLink2,
        imageLink3: imageLink3,
        imageLink4: "" //not in use
      };

      
      console.log("file that will be uploaded to the server: ",data);

      //URL for the server - POST request
      const URL = `http://localhost:8080/api/products/${id}`

      //send data to the server
      const response = await axios.put(URL, data);
      if(response.data.id){
        console.log("Product updated successfully");
        alert("Product updated successfully");
      }



    } catch (error) {
      // Handle any errors during the upload process
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  }


  //URL for the server - GET request
  const url = `http://localhost:8080/api/products/product/${id}`;
  //fetch product details from the server
  const fetchData = async () => {
    try {
      const response = await axios(url);
      console.log("response got from server : ",response.data)
      return response.data;
    } catch (error) {
      console.log(error.response)
    }
  }

  //fetch product details from the server
  useEffect(() => {

    fetchData().then((data) => {
      setProduct(data.productName)
      setManufacturer(data.productManufacturer)
      setQuantity(data.quantity)
      setPrice(data.price)
      setDescription(data.productDescription)
      setViewImages([data.imageLink1, data.imageLink2, data.imageLink3])
      
    });


  }, [])





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
        <h2 className="text-3xl font-bold tracking-tight text-orange-700 sm:text-4xl">Update Product Details</h2>
      </div>

      {/* form */}
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

          {/* Manufacturer */}
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

export default UpdateProduct