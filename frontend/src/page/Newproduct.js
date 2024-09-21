import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsCloudUpload } from "react-icons/bs"
import { ImagetoBase64 } from '../utility/ImagetoBase64'

const Newproduct = () => {
  const [data, setData] = useState(false);  
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (file.size > 1024 * 1024) { // 1MB limit
      toast.error("Image size should be less than 1MB")
      return
    }
    const imageData = await ImagetoBase64(file)
    setData(prev => ({ ...prev, image: imageData }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, image, category, price } = data

    if (!name || !image || !category || !price) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/uploadProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong")
      }

      toast.success(result.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <form className='m-auto w-full max-w-md shadow flex flex-col p-3 bg-white' onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input type="text" id="name" name="name" className='bg-slate-200 p-1 my-1' onChange={handleOnChange} value={data.name} required />

        <label htmlFor='category'>Category</label>
        <select className='bg-slate-200 p-1 my-1' id='category' name='category' onChange={handleOnChange} value={data.category} required>
          <option value="">select category</option>
          <option value="fruits">Fruits</option>
          <option value="vegetable">Vegetable</option>
          <option value="icream">Ice Cream</option>
          <option value="dosa">Dosa</option>
          <option value="pizza">Pizza</option>
          <option value="rice">Rice</option>
          <option value="cake">Cake</option>
          <option value="burger">Burger</option>
          <option value="panner">Paneer</option>
          <option value="sandwich">Sandwich</option>
        </select>

        <label htmlFor='image'>Image
          <div className='h-40 w-full bg-slate-200 rounded flex items-center justify-center cursor-pointer'>
            {/* {data.image ? <img src={data.image} alt="Product" className="h-full" /> : <span className='text-5xl'> <span />} */}
            <input type="file" accept="image/*" id="image" onChange={uploadImage} className="hidden" required />
          </div>
        </label>

        <label htmlFor='price' className='my-1'>Price</label>
        <input type="number" className='bg-slate-200 p-1 my-1' id='price' name='price' onChange={handleOnChange} value={data.price} required />

        <label htmlFor='description'>Description</label>
        <textarea rows={2} id='description' value={data.description} className='bg-slate-200 p-1 my-1 resize-none' name='description' onChange={handleOnChange}></textarea>

        <button type="submit" className='bg-red-500 hover:bg-red-600 text-white text-lg font-medium my-2 drop-shadow' disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}

export default Newproduct
