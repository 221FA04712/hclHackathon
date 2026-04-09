import React from "react";
import { useCart } from "../store/cart-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function CartTable() {
  const { cart, addToCart, removeFromCart, totalPrice, basePrice, discount } = useCart();

  const updateCartQuantity = (productId, quantity) => {
    const product = cart.find((item) => item.productId === productId);
    addToCart(product, quantity - (product?.quantity || 0));
  };

  return (
    <div className="min-h-80 max-w-4xl mx-auto my-8 w-full font-primary">
      <table className="w-full">
        <thead>
          <tr className="uppercase text-sm text-primary dark:text-light border-b border-primary dark:border-light">
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Quantity</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Remove</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary dark:divide-light">
          {cart.map((item) => (
            <tr
              key={item.productId}
              className="text-sm sm:text-base text-primary dark:text-light text-center"
            >
              <td className="px-4 sm:px-6 py-4 flex items-center">
                <Link
                  to={`/products/${item.productId}`}
                  state={{ product: item }}
                  className="flex items-center"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover mr-4 hover:scale-110 transition-transform"
                  />
                  <span className="text-primary dark:text-light hover:underline">
                    {item.name}
                  </span>
                </Link>
              </td>
              <td className="px-4 sm:px-6 py-4">
                {item.availableQuantity <= 0 ? (
                  <span className="text-red-500 font-bold whitespace-nowrap">Out of Stock</span>
                ) : (
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max={item.availableQuantity}
                    value={item.quantity > item.availableQuantity ? item.availableQuantity : item.quantity}
                    onChange={(e) => {
                      let val = parseInt(e.target.value, 10) || 1;
                      if (item.availableQuantity && val > item.availableQuantity) val = item.availableQuantity;
                      updateCartQuantity(item.productId, val);
                    }}
                    className="w-16 px-2 py-1 border rounded-md focus:ring focus:ring-light dark:focus:ring-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                )}
              </td>
              <td className="px-4 sm:px-6 py-4 text-base font-light">
                ${item.price.toFixed(2)}
              </td>
              <td className="px-4 sm:px-6 py-4">
                <button
                  aria-label="delete-item"
                  onClick={() => removeFromCart(item.productId)}
                  className="text-primary dark:text-red-400 border border-primary dark:border-red-400 p-2 rounded hover:bg-lighter dark:hover:bg-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </td>
            </tr>
          ))}
          {cart.length > 0 && (
            <tr className="text-center">
              <td></td>
              <td className="text-base text-gray-600 dark:text-gray-300 font-semibold uppercase px-4 sm:px-6 py-4">
                Subtotal
              </td>
              <td className="text-lg text-primary dark:text-blue-400 font-medium px-4 sm:px-6 py-4">
                {totalPrice < basePrice ? (
                  <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-2">
                    <span className="line-through text-gray-400 dark:text-gray-500 text-sm">
                      ${basePrice.toFixed(2)}
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span>${basePrice.toFixed(2)}</span>
                )}
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
