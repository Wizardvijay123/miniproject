'use client'

import { useState } from 'react'

export default function PostForm() {
  const [formData, setFormData] = useState({
    foodName: '',
    location: '',
    quantity: 1,
    photo: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'photo') {
      setFormData({ ...formData, photo: files?.[0] ?? null })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = new FormData()
    data.append('foodName', formData.foodName)
    data.append('location', formData.location)
    data.append('quantity', formData.quantity.toString())
    if (formData.photo) {
      data.append('photo', formData.photo)
    }

    // Example: Submit to backend
    // fetch('/api/post', { method: 'POST', body: data })

    console.log('Form submitted', formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-8"
    >
      <h2 className="text-3xl font-semibold text-gray-800">Share Your Food</h2>
      <p className="text-gray-600">Fill out the details below to post your food.</p>

      <div>
        <label className="block text-sm font-medium text-gray-700">Food Name</label>
        <input
          type="text"
          name="foodName"
          value={formData.foodName}
          onChange={handleChange}
          required
          placeholder="Enter the food name"
          className="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:ring-2 focus:outline-none transition-all duration-200 ease-in-out hover:ring-2 hover:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="Where is the food located?"
          className="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:ring-2 focus:outline-none transition-all duration-200 ease-in-out hover:ring-2 hover:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          required
          placeholder="How many portions?"
          className="mt-2 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:ring-2 focus:outline-none transition-all duration-200 ease-in-out hover:ring-2 hover:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Food Photo</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:rounded-md file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 transition-all duration-200 ease-in-out"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-md focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-105"
      >
        Submit Your Post
      </button>
    </form>
  )
}
