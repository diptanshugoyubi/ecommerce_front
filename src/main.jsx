import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import UpdateProduct from './components/UpdateProduct/UpdateProduct.jsx'
import AddNewProduct from './components/AddNewProduct/AddNewProduct.jsx'
import Product from './components/Product/Product.jsx'
import NotFound from './components/NotFound/NotFound.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element= {<App/>} >
        <Route path='' element= {<Home/>}/>
        <Route path='updateProduct/:id' element= {<UpdateProduct/>}/>
        <Route path='addNewProduct' element= {<AddNewProduct/>}/>
        <Route path='product/:id' element={<Product/>}/>
        <Route path='*' element={<NotFound/>} />
        
        {/* <Route 
        loader={githubInfoLoader}
        path='github' 
        element={<Github/>} /> */}
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
