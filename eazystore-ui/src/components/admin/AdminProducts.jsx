import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import PageTitle from "../PageTitle";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const products = useLoaderData();
  const revalidator = useRevalidator();
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleNew = () => {
    setEditingProduct({ isNew: true });
    setFormData({
      name: "", description: "", price: 0, popularity: 0, imageUrl: "",
      brand: "", category: "", packaging: "", availableQuantity: 0
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct.isNew) {
        await apiClient.post("/admin/products", formData);
        toast.success("Product created.");
      } else {
        await apiClient.put(`/admin/products/${editingProduct.productId}`, formData);
        toast.success("Product updated.");
      }
      setEditingProduct(null);
      revalidator.revalidate();
    } catch (error) {
      toast.error("Failed to save product.");
    }
  };

  return (
    <div className="min-h-[852px] container mx-auto px-6 py-12 font-primary dark:bg-darkbg">
      <div className="flex justify-between items-center mb-6 mt-4">
        <PageTitle title="Centralized Product Portal" />
        <button onClick={handleNew} className="px-4 py-2 bg-primary text-white rounded dark:bg-light hover:bg-dark transition">Add New Product</button>
      </div>

      {editingProduct && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-8">
          <h2 className="text-xl font-bold mb-4 dark:text-white">{editingProduct.isNew ? "Create Product" : "Edit Product"}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Name</label>
              <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required className="mt-1 block w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Brand</label>
              <input type="text" name="brand" value={formData.brand || ""} onChange={handleChange} required className="mt-1 block w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Category</label>
              <input type="text" name="category" value={formData.category || ""} onChange={handleChange} required className="mt-1 block w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Packaging</label>
              <input type="text" name="packaging" value={formData.packaging || ""} onChange={handleChange} required className="mt-1 block w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Description</label>
              <input type="text" name="description" value={formData.description || ""} onChange={handleChange} required className="mt-1 block w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Image URL</label>
              <input type="text" name="imageUrl" value={formData.imageUrl || ""} onChange={handleChange} className="mt-1 block w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Price ($)</label>
              <input type="number" step="0.01" name="price" value={formData.price || 0} onChange={handleChange} required className="mt-1 block w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Available Quantity</label>
              <input type="number" name="availableQuantity" value={formData.availableQuantity || 0} onChange={handleChange} required className="mt-1 block w-full border rounded p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
               <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">Cancel</button>
               <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Save</button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-center text-xl dark:text-white">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
            <thead>
              <tr className="border-b dark:border-gray-700 text-left text-gray-600 dark:text-gray-300">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Brand</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Packaging</th>
                <th className="p-4 font-semibold">Qty</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.productId} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="p-4 dark:text-gray-200">{p.name}</td>
                  <td className="p-4 dark:text-gray-200">{p.brand}</td>
                  <td className="p-4 dark:text-gray-200">{p.category}</td>
                  <td className="p-4 dark:text-gray-200">{p.packaging}</td>
                  <td className={`p-4 dark:text-gray-200 font-medium ${p.availableQuantity <= 0 ? 'text-red-500' : ''}`}>{p.availableQuantity}</td>
                  <td className="p-4 dark:text-gray-200">${p.price}</td>
                  <td className="p-4">
                    <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 font-medium transition">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export async function adminProductsLoader() {
  try {
    const response = await apiClient.get("/products"); 
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage || "Failed to fetch products.",
      { status: error.status || 500 }
    );
  }
}
