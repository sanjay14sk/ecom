import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartFeedback, setCartFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error('Failed to load product', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to your cart');
      return;
    }
    const res = await addToCart(product.id, quantity);
    if (res.success) {
      setCartFeedback('Added to cart!');
      setTimeout(() => setCartFeedback(''), 2000);
    } else {
      alert(res.message);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      alert('Please login to manage wishlist');
      return;
    }
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 vh-100">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h3>Product not found</h3>
        <Link to="/" className="btn btn-warning mt-3 rounded-pill">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-warning text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Product Image */}
        <div className="col-md-6">
          <div className="ratio ratio-1x1 bg-light rounded-4 overflow-hidden shadow-sm border border-light-subtle d-flex align-items-center justify-content-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`}
                className="img-fluid object-fit-cover w-100 h-100"
                alt={product.name}
              />
            ) : (
              <div className="text-muted d-flex flex-column align-items-center justify-content-center h-100">
                <i className="bi bi-image fs-1"></i>
                <span>No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details info */}
        <div className="col-md-6">
          <div className="d-flex flex-column h-100">
            <span className="badge bg-secondary-subtle text-secondary align-self-start mb-3 px-3 py-2 rounded-pill text-uppercase font-semibold">
              {product.categoryName}
            </span>
            <h1 className="fw-bold mb-2">{product.name}</h1>
            
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fs-2 fw-extrabold text-dark">${product.price.toFixed(2)}</span>
              {product.stock > 0 ? (
                <span className="badge bg-success px-3 py-2 rounded-pill">In Stock</span>
              ) : (
                <span className="badge bg-danger px-3 py-2 rounded-pill">Out of Stock</span>
              )}
            </div>

            <p className="text-muted mb-4 fs-5" style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
            
            <hr className="mb-4" />

            {product.stock > 0 && (
              <div className="mb-4">
                <label className="form-label fw-semibold text-muted mb-2">Select Quantity</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="input-group" style={{ width: '130px' }}>
                    <button
                      className="btn btn-outline-secondary rounded-start-3"
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="text"
                      className="form-control text-center fw-bold"
                      value={quantity}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary rounded-end-3"
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  <span className="text-muted small">Only {product.stock} items left in stock</span>
                </div>
              </div>
            )}

            <div className="d-flex gap-3 mt-auto align-items-center">
              <button
                className="btn btn-warning btn-lg px-5 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <i className="bi bi-cart-plus fs-5"></i> Add to Cart
              </button>

              <button
                className={`btn btn-outline-${isInWishlist(product.id) ? 'danger' : 'secondary'} btn-lg px-3 rounded-circle d-flex align-items-center justify-content-center`}
                onClick={handleWishlistToggle}
                style={{ width: '52px', height: '52px' }}
              >
                <i className={`bi ${isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'} fs-5`}></i>
              </button>

              {cartFeedback && (
                <span className="text-success fw-bold animate-pulse">{cartFeedback}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
