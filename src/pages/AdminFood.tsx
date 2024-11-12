//src/pages/AdminFood.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFoodItems } from '../lib/api'
import { UtensilsCrossed, Plus, Pencil, Trash2 } from 'lucide-react'
import type { Food } from '../types'

export
function AdminFood() {
  const [isAddingFood, setIsAddingFood] = useState(false)
  const { data: foodItems, isLoading } = useQuery({
    queryKey: ['food'],
    queryFn: getFoodItems,
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Food Items</h1>
        <button
          onClick={() => setIsAddingFood(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Food Item
        </button>
      </div>

      {isAddingFood && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Food Item Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingFood(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save Food Item
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems?.map((food: Food) => (
            <div key={food.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <UtensilsCrossed className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold">{food.name}</h2>
              </div>
              <div className="text-gray-600 mb-4">
                <div className="font-semibold">
                  Price: ₹{food.price}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button className="p-2 text-blue-600 hover:text-blue-800">
                  <Pencil className="h-5 w-5" />
                </button>
                <button className="p-2 text-red-600 hover:text-red-800">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}