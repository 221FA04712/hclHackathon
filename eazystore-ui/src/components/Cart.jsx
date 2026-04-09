import React, { useMemo, useState } from "react";
import PageTitle from "./PageTitle";
import { Link } from "react-router-dom";
import emptyCartImage from "../assets/util/emptycart.png";
import { useCart } from "../store/cart-context";
import CartTable from "./CartTable";
import { useAuth } from "../store/auth-context";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";

export default function Cart() {
  const { cart, discount, setDiscount, pointsToRedeem, setPointsToRedeem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const { isAuthenticated, user, loginSuccess, jwtToken } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && jwtToken) {
      apiClient.get('/profile')
        .then(res => {
          if (res.data && res.data.loyaltyPoints !== user?.loyaltyPoints) {
            loginSuccess(jwtToken, res.data);
          }
        })
        .catch(err => console.error("Could not sync loyalty points", err));
    }
  }, [isAuthenticated, jwtToken]);

  const isAddressIncomplete = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!user.address) return true;
    const { street, city, state, postalCode, country } = user.address;
    return !street || !city || !state || !postalCode || !country;
  }, [user]);

  // Memoize the cart length check to prevent re-renders
  const isCartEmpty = useMemo(() => cart.length === 0, [cart.length]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a valid coupon code.");
      return;
    }
    try {
      const response = await apiClient.get(`/coupons/validate?code=${couponCode}`);
      setDiscount(response.data.discountPercentage);
      toast.success(`Coupon applied! ${response.data.discountPercentage}% off!`);
    } catch (error) {
      setDiscount(0);
      toast.error("Invalid or expired coupon code.");
    }
  };

  const handleUseLoyaltyPoints = () => {
    if (user && user.loyaltyPoints && user.loyaltyPoints > 0) {
      if (pointsToRedeem > 0) {
        setPointsToRedeem(0);
        toast.info("Loyalty points removed from cart.");
      } else {
        setPointsToRedeem(user.loyaltyPoints);
        toast.success(`Applied ${user.loyaltyPoints} loyalty points!`);
      }
    } else {
      toast.warning("You do not have any loyalty points to redeem.");
    }
  };

  return (
    <div className="min-h-[852px] py-12 bg-normalbg dark:bg-darkbg font-primary">
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle title="Your Cart" />
        {!isCartEmpty ? (
          <>
            {isAddressIncomplete && (
              <p className="text-red-500 text-lg mt-2 text-center">
                Please update your address in your profile to proceed to
                checkout.
              </p>
            )}
            <CartTable />

            {/* Promo Code Section */}
            <div className="mt-6 p-4 bg-white dark:bg-gray-700 shadow-sm rounded-md flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="w-full sm:w-auto flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <button 
                  onClick={handleApplyCoupon} 
                  className="px-4 py-2 bg-primary text-white font-medium rounded hover:bg-dark transition dark:bg-light dark:text-black dark:hover:bg-lighter"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <div className="text-green-600 font-bold dark:text-green-400">
                  {discount}% Discount Applied!
                </div>
              )}
            </div>

            {/* Loyalty Points Section */}
            {isAuthenticated && user && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-700 shadow-sm rounded-md flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-lighter">Your Loyalty Points: {user.loyaltyPoints || 0}</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">(1 point = $0.01 discount)</span>
                </div>
                <button
                  onClick={handleUseLoyaltyPoints}
                  disabled={!user.loyaltyPoints || user.loyaltyPoints === 0}
                  className={`px-4 py-2 font-medium rounded transition ${
                    pointsToRedeem > 0 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "bg-primary text-white hover:bg-dark dark:bg-light dark:text-black dark:hover:bg-lighter"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pointsToRedeem > 0 ? "Remove Points" : "Use your loyalty points"}
                </button>
              </div>
            )}

            {pointsToRedeem > 0 && (
              <div className="mt-2 text-green-600 font-bold dark:text-green-400 text-right pr-4">
                Loyalty Discount: ${(pointsToRedeem * 0.01).toFixed(2)}
              </div>
            )}

            <div className="flex justify-between mt-8 space-x-4">
              {/* Back to Products Button */}
              <Link
                to="/home"
                className="py-2 px-4 bg-primary dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
              >
                Back to Products
              </Link>
              {/* Proceed to Checkout Button */}
              <Link
                to={isAddressIncomplete ? "#" : "/checkout"}
                className={`py-2 px-4 text-xl font-semibold rounded-sm flex justify-center items-center transition
                                    ${
                                      isAddressIncomplete
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter"
                                    } text-white dark:text-black`}
                onClick={(e) => {
                  if (isAddressIncomplete) {
                    e.preventDefault();
                  }
                }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 dark:text-lighter flex flex-col items-center">
            <p className="max-w-[576px] px-2 mx-auto text-base mb-4">
              Oops... Your cart is empty. Continue shopping
            </p>
            <img
              src={emptyCartImage}
              alt="Empty Cart"
              className="max-w-[300px] mx-auto mb-6 dark:bg-light dark:rounded-md"
            />
            <Link
              to="/home"
              className="py-2 px-4 bg-primary dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
            >
              Back to Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
