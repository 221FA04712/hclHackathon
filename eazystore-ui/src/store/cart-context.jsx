import { createContext, useEffect, useContext, useReducer, useState } from "react";
import { toast } from "react-toastify";

// STEP 1
export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const CLEAR_CART = "CLEAR_CART";

const cartReducer = (prevCart, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { product, quantity } = action.payload;
      const existingItem = prevCart.find(
        (item) => item.productId === product.productId
      );

      if (existingItem) {
        return prevCart.map((item) => {
          if (item.productId === product.productId) {
            let newQty = item.quantity + quantity;
            if (newQty > product.availableQuantity) {
              newQty = product.availableQuantity;
            }
            if (newQty <= 0) newQty = 0;
            return { ...item, quantity: newQty };
          }
          return item;
        });
      }
      
      let initialQty = quantity;
      if (initialQty > product.availableQuantity) initialQty = product.availableQuantity;
      if (initialQty <= 0) initialQty = 0;
      
      return [...prevCart, { ...product, quantity: initialQty }];
    case REMOVE_FROM_CART:
      return prevCart.filter(
        (item) => item.productId !== action.payload.productId
      );
    case CLEAR_CART:
      return [];
    default:
      return prevCart;
  }
};

export const CartProvider = ({ children }) => {
  const initialCartState = (() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        return parsed.map(item => {
          // Cap quantity at availableQuantity. If out of stock, quantity becomes 0.
          if (item.availableQuantity <= 0) {
            return { ...item, quantity: 0 };
          } else if (item.quantity > item.availableQuantity) {
            return { ...item, quantity: item.availableQuantity };
          }
          return item;
        });
      }
      return [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  })();

  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const [discount, setDiscount] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (product, quantity) => {
    if (product.availableQuantity <= 0) {
      toast.error(`${product.name} is out of stock!`);
      return;
    }

    const currentItem = cart.find(item => item.productId === product.productId);
    const existingQuantity = currentItem ? currentItem.quantity : 0;
    
    if (quantity > 0 && existingQuantity + quantity > product.availableQuantity) {
      toast.error(`Only ${product.availableQuantity} left in stock for ${product.name}!`);
      const quantityToAdd = product.availableQuantity - existingQuantity;
      if (quantityToAdd > 0) {
        dispatch({ type: ADD_TO_CART, payload: { product, quantity: quantityToAdd } });
      }
      return;
    }

    dispatch({ type: ADD_TO_CART, payload: { product, quantity } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  // Calculate total quantity
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate base price
  const basePrice = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  // Calculate total price with discount and loyalty points
  const totalPriceWithDiscount = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
  const actualPointsToRedeem = Math.min(pointsToRedeem, Math.ceil(totalPriceWithDiscount * 100));
  const totalPrice = Math.max(0, totalPriceWithDiscount - (actualPointsToRedeem * 0.01));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalQuantity,
        totalPrice,
        basePrice,
        discount,
        setDiscount,
        pointsToRedeem: actualPointsToRedeem,
        setPointsToRedeem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
