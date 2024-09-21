import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };
  
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/product`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleUpdate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/updateProduct/${editingProduct._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      toast.success('Product updated successfully');
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/deleteProduct/${productId}`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={handleSearch}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="border border-gray-300 p-2">
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editingProduct.name}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="text"
                      name="category"
                      value={editingProduct.category}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300"
                    />
                  ) : (
                    product.category
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editingProduct.price}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300"
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingProduct && editingProduct._id === product._id ? (
                    <input
                      type="text"
                      name="description"
                      value={editingProduct.description}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300"
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingProduct && editingProduct._id === product._id ? (
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && filteredProducts.length === 0 && (
        <p className="text-center mt-4">No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
