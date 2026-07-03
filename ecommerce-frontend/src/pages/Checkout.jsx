import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setShippingAddress(user.address || '');
    }
  }, [user]);

  const getSubtotal = () => {
    return cart.items ? cart.items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0) : 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress) {
      alert('Please provide a shipping address');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/orders', { shippingAddress, paymentMethod });
      setPlacedOrder(res.data);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="mb-4">
          <i className="bi bi-patch-check-fill text-success" style={{ fontSize: '5rem' }}></i>
        </div>
        <h2 className="fw-bold text-success mb-3">Order Placed Successfully!</h2>
        <p className="text-muted mb-4 col-md-6 mx-auto">
          Thank you for your purchase. Your order <strong>#{placedOrder.id}</strong> has been received and is being processed.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/orders" className="btn btn-warning px-5 py-2.5 rounded-pill fw-bold shadow-sm">
            View My Orders
          </Link>
          <Link to="/" className="btn btn-outline-dark px-5 py-2.5 rounded-pill">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>No items in cart to checkout</h3>
        <Link to="/" className="btn btn-warning mt-3 rounded-pill px-4">
          Go Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Checkout</h2>

      <div className="row g-4">
        {/* Checkout Billing details */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 rounded-4 p-5 bg-light">
            <h4 className="fw-bold mb-4">Shipping & Payment Info</h4>
            
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-4">
                <label className="form-label fw-semibold text-muted">Shipping Address</label>
                <textarea
                  className="form-control rounded-3"
                  rows="4"
                  placeholder="Enter full physical shipping address..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-muted">Payment Method</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="payment1"
                      value="Credit Card"
                      checked={paymentMethod === 'Credit Card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label fw-medium text-dark" htmlFor="payment1">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="payment2"
                      value="Cash On Delivery"
                      checked={paymentMethod === 'Cash On Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label fw-medium text-dark" htmlFor="payment2">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-warning btn-lg w-100 py-3 rounded-pill fw-bold shadow-sm text-uppercase mt-4"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                Complete Purchase (${getSubtotal().toFixed(2)})
              </button>
            </form>
          </div>
        </div>

        {/* Order Items recap */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <h4 className="fw-bold mb-4">Your Order</h4>
            
            <ul className="list-group list-group-flush mb-4">
              {cart.items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center py-3 px-0">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-light rounded-2 overflow-hidden d-flex align-items-center justify-content-center me-3"
                      style={{ width: '50px', height: '50px' }}
                    >
                      {item.productImageUrl ? (
                        <img
                          src={item.productImageUrl.startsWith('http') ? item.productImageUrl : `http://localhost:8080${item.productImageUrl}`}
                          className="img-fluid object-fit-cover w-100 h-100"
                          alt={item.productName}
                        />
                      ) : (
                        <i className="bi bi-image text-muted small"></i>
                      )}
                    </div>
                    <div>
                      <h6 className="my-0 fw-bold text-dark">{item.productName}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                  </div>
                  <span className="text-muted fw-bold">${(item.productPrice * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="fw-bold text-dark">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Shipping</span>
              <span className="text-success fw-bold">FREE</span>
            </div>
            
            <hr className="my-3" />

            <div className="d-flex justify-content-between align-items-center">
              <span className="fs-5 fw-bold">Grand Total</span>
              <span className="fs-4 fw-extrabold text-dark">${getSubtotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
