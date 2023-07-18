"use client"

import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  // Assuming you have an array of stock items
  // const stock = [
  //   { id: 1, name: "Product 1", quantity: 10, price: 20 },
  //   { id: 2, name: "Product 2", quantity: 5 , price: 20},
  //   { id: 3, name: "Product 3", quantity: 8 , price: 20},
  // ];

  const [productForm, setproductForm] = useState({}) // store input while adding product.
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false) // for button click
  const [dropdown, setDropdown] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product')
      let rjson = await response.json();
      setProducts(rjson.products)
    }
    fetchProducts()
  }, [])
  
  const fetchProducts = async () => {
    const response = await fetch('/api/product')
    let rjson = await response.json();
    setProducts(rjson.products)
  }

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      setLoadingaction(true)
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      if (response.ok) {
        // Product added successfully
        // You can perform additional actions here, such as updating the stock or showing a success message
        console.log("Product added succesfully")
        // setAlert("Your Product has been added!!")
        window.alert("Your Prouduct has been added!!")
        setproductForm({}) // make input empty after successfull adding.
      } else {
        // Handle error response
        // You can display an error message or perform any necessary error handling
        console.log("Error adding product!!")
      }
      fetchProducts() // Update the table with new product // fetch the all product again.
      setLoadingaction(false)
    } catch (error) {
      // Handle fetch error
      // You can display an error message or perform any necessary error handling
      console.log("Error: "+error);
    }
  };

  const handleChange = (e) => {
    setproductForm({...productForm, [e.target.name]: e.target.value})
  }

  const onDropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value)
    console.log("value = ",value, value.length)
    
    if(value.length >= 1) {
    // if(!loading) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json();
      setDropdown(rjson.products)
      setLoading(false);
    } else {
      setDropdown([])
    }
  }

  const buttonAction = async (action, slug, initialQuantity) => { 
    // Immediately change the quantity of the product with given slug in products
    let index = products.findIndex((item) => item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if(action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1
    }else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }
    setProducts(newProducts)

    // Immediately change the quantity of the product with given slug in Dropdown
    let indexdrop = dropdown.findIndex((item) => item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if(action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
    }else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }
    setDropdown(newDropdown)


    console.log(action, slug, initialQuantity)
    setLoadingaction(true)
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({action, slug, initialQuantity})
    });
    let r = await response.json();
    console.log(r)
    setLoadingaction(false)
   }

  return (
    <>
      <Header />

      {/* Search */}
      <div className="container  mx-auto">
        <div className='text-green-500 text-center'>{alert}</div>
        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
        {/* <div className="flex items-center"> */}
        <div className="flex">
          <input
            // onBlur={() => {setDropdown([]); setLoading(false)}}
            onChange={onDropdownEdit}
            type="text"
            placeholder="Enter product name..."
            className="flex-1 border border-gray-300 px-4 py- mr-2 rounded-r-md rounded-l-md"
          />
          <select
            name="searchType"
            id="searchType"
            className="border border-gray-300 px-4 py-2 rounded-r-md rounded-full"
            >
            <option value="">All</option>
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-l-md rounded-full">
            Search
          </button>
        </div>
            {loading && <div className="flex justify-center items-center"> <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 40 40" stroke="black">
  <g fill="none" fillRule="evenodd">
    <g transform="translate(2 2)" strokeWidth="4">
      <circle strokeOpacity=".5" cx="18" cy="18" r="18" stroke="#0000FF">
        <animate attributeName="r" begin="0s" dur="1.8s" values="18;12;6;18" calcMode="linear" repeatCount="indefinite" />
        <animate attributeName="strokeOpacity" begin="0s" dur="1.8s" values=".5;1;.5;.5" calcMode="linear" repeatCount="indefinite" />
        <animate attributeName="strokeWidth" begin="0s" dur="1.8s" values="4;0;0;4" calcMode="linear" repeatCount="indefinite" />
      </circle>
      <circle cx="18" cy="18" r="12">
        <animate attributeName="r" begin="0s" dur="1.8s" values="12;6;18;12" calcMode="linear" repeatCount="indefinite" />
        <animate attributeName="strokeOpacity" begin="0s" dur="1.8s" values="1;.5;.5;1" calcMode="linear" repeatCount="indefinite" />
        <animate attributeName="strokeWidth" begin="0s" dur="1.8s" values="0;4;4;0" calcMode="linear" repeatCount="indefinite" />
      </circle>
    </g>
  </g>
</svg>
</div>
}
            <div className="dropcontainer absolute w-[70vw] border-1 bg-purple-100 rounded-md">
            {dropdown.map(item => {
              return <div key={item.slug} className="container flex justify-between p-3 my-1 border-b-2 border-gray-300 rounded">
                <span className="slug">{item.slug} ({item.quantity} available for ₹{item.price})</span>
                <div className="mx-1">
                  <button onClick={() => {buttonAction("minus",item.slug, item.quantity)}} disabled={loadingaction} className="subtract px-3 py-1 bg-purple-500 rounded-lg shadow-md text-white font-semibold inline-block cursor-pointer disabled:bg-purple-200"> - </button>
                  <span className="quantity mx-3 inline-block w-4 text-center">{item.quantity}</span>
                  <button onClick={() => {buttonAction("plus",item.slug, item.quantity)}} disabled={loadingaction} className="add px-3 py-1 bg-purple-500 rounded-lg shadow-md text-white font-semibold inline-block cursor-pointer disabled:bg-purple-200"> + </button>
                </div>
              </div>
            })}
            </div>
      </div>


      {/* Display Current Stock */}
      <div className="container  mx-auto my-6">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>

        {/* <form onSubmit={handleSubmit}> */}
        <form>
          <div className="mb-4">
            <label htmlFor="productName" className="block mb-2">
              Product Slug:
            </label>
            <input
              onChange={handleChange}
              value={productForm?.slug || ""}
              type="text"
              id="productName"
              name="slug"
              className="w-full border border-gray-300 px-4 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">
              Quantity:
            </label>
            <input
              onChange={handleChange}
              type="number"
              value={productForm?.quantity || ""}
              id="quantity"
              name="quantity"
              className="w-full border border-gray-300 px-4 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">
              Price:
            </label>
            <input
              onChange={handleChange}
              type="number"
              value={productForm?.price || ""}
              id="price"
              name="price"
              className="w-full border border-gray-300 px-4 py-2"
              required
            />
          </div>

          {/* <button type="submit" className="bg-blue-500 text-white px-4 py-2"> */}
          <button onClick={addProduct} disabled={loadingaction} type="submit" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md mx-auto disabled:bg-purple-200">
  Add Product
</button>

        </form>
      </div>

      {/* Display stock */}
      <div className="container my-6  mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>

        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Product Name</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              return <tr key={product._id}>
              <td className="px-4 py-2 border">{product._id}</td>
              <td className="px-4 py-2 border">{product.slug}</td>
              <td className="px-4 py-2 border">{product.quantity}</td>
              <td className="px-4 py-2 border">₹{product.price}</td>
            </tr>
            })}
            {/* {stock.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 border">{item.id}</td>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">{item.quantity}</td>
                <td className="px-4 py-2 border">{item.price}</td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>

      
    </>
  );
}

// import Header from '@/components/Header'
// import Image from 'next/image'

// export default function Home() {
//   return (
//     <>
//     <Header/>
//     {/* Display Current Stock */}
//     <div className='container  mx-auto'>
//       <h1>Add a Product</h1>

//       <h1>Display Currernt Stock</h1>
//     </div>
//     </>
//   )
// }
