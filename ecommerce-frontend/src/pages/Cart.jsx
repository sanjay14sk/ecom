import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const getSubtotal = () => {
    return cart.items ? cart.items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0) : 0;
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h2 className="fw-bold mt-4">Your Cart is Empty</h2>
        <p className="text-muted">Fill it with amazing items from our catalog.</p>
        <Link to="/" className="btn btn-warning mt-3 px-5 py-2.5 rounded-pill fw-bold shadow-sm">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Shopping Cart</h2>

      <div className="row g-4">
        {/* Cart items list */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
            <div className="table-responsive">
              <table className="table table-align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                    <th scope="col" className="text-end pe-4">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-4 py-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-light rounded-3 overflow-hidden d-flex align-items-center justify-content-center me-3 shadow-xs"
                            style={{ width: '70px', height: '70px' }}
                          >
                            {item.productImageUrl ? (
                              <img
                                src={item.productImageUrl.startsWith('http') ? item.productImageUrl : `http://localhost:8080${item.productImageUrl}`}
                                className="img-fluid object-fit-cover w-100 h-100"
                                alt={item.productName}
                              />
                            ) : (
                              <i className="bi bi-image text-muted"></i>
                            )}
                          </div>
                          <div>
                            <Link to={`/products/${item.productId}`} className="text-decoration-none text-dark fw-bold">
                              {item.productName}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">${item.productPrice.toFixed(2)}</td>
                      <td className="py-4">
                        <div className="input-group input-group-sm" style={{ width: '100px' }}>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center fw-bold"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 fw-bold">${(item.productPrice * item.quantity).toFixed(2)}</td>
                      <td className="py-4 text-end pe-4">
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <i className="bi bi-trash-fill fs-5"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <Link to="/" className="btn btn-outline-dark rounded-pill px-4">
              <i className="bi bi-arrow-left me-2"></i>Continue Shopping
            </Link>
            <button className="btn btn-outline-danger rounded-pill px-4" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-light">
            <h4 className="fw-bold mb-4">Summary</h4>
            
            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Items Total</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Shipping</span>
              <span className="text-success fw-bold">FREE</span>
            </div>

            <hr className="my-4" />

            <div className="d-flex justify-content-between mb-4">
              <span className="fs-5 fw-bold">Grand Total</span>
              <span className="fs-4 fw-extrabold text-dark">${getSubtotal().toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn-warning w-100 py-3 rounded-pill fw-bold shadow-sm text-uppercase tracking-wider">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
