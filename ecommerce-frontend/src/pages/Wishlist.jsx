import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, addToCart, removeFromWishlist } = useContext(CartContext);

  const handleAddToCart = async (productId) => {
    const res = await addToCart(productId, 1);
    if (res.success) {
      alert('Added to cart!');
    } else {
      alert(res.message);
    }
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <i className="bi bi-heart display-1 text-muted"></i>
        <h2 className="fw-bold mt-4">Your Wishlist is Empty</h2>
        <p className="text-muted">Tap the heart on products you love to save them here.</p>
        <Link to="/" className="btn btn-warning mt-3 px-5 py-2.5 rounded-pill fw-bold shadow-sm">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">My Wishlist</h2>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {wishlist.map((p) => (
          <div key={p.id} className="col">
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card position-relative">
              <button
                className="btn btn-light shadow-sm rounded-circle position-absolute top-0 end-0 m-3 z-2 d-flex align-items-center justify-content-center p-2"
                onClick={() => removeFromWishlist(p.id)}
                style={{ width: '38px', height: '38px' }}
              >
                <i className="bi bi-heart-fill text-danger fs-5"></i>
              </button>

              <Link to={`/products/${p.id}`} className="text-decoration-none text-dark">
                <div className="ratio ratio-4x3 bg-light d-flex align-items-center justify-content-center overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:8080${p.imageUrl}`}
                      className="img-fluid object-fit-cover w-100 h-100"
                      alt={p.name}
                    />
                  ) : (
                    <div className="text-muted d-flex flex-column align-items-center justify-content-center h-100">
                      <i className="bi bi-image fs-2"></i>
                      <span className="small">No Image</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="card-body d-flex flex-column p-4">
                <span className="badge bg-secondary-subtle text-secondary align-self-start mb-2 px-3 py-1.5 rounded-pill text-uppercase fs-8 fw-semibold">
                  {p.categoryName}
                </span>
                <Link to={`/products/${p.id}`} className="text-decoration-none text-dark">
                  <h6 className="card-title fw-bold text-truncate mb-2">{p.name}</h6>
                </Link>
                <p className="card-text text-muted small text-truncate-2 mb-3">{p.description}</p>
                
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-extrabold text-dark">${p.price.toFixed(2)}</span>
                  <button
                    className="btn btn-warning btn-sm px-3 rounded-pill fw-semibold shadow-sm d-flex align-items-center gap-1"
                    onClick={() => handleAddToCart(p.id)}
                    disabled={p.stock === 0}
                  >
                    <i className="bi bi-cart-plus"></i> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
