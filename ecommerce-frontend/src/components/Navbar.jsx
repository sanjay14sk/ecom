import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-gradient d-flex align-items-center" to="/">
          <i className="bi bi-cart3 me-2 text-warning"></i>
          <span>ShopSphere</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Catalog
              </Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link position-relative" to="/wishlist">
                    Wishlist
                    <i className="bi bi-heart-fill text-danger ms-1"></i>
                  </Link>
                </li>
                {isAdmin() && (
                  <li className="nav-item">
                    <Link className="nav-link btn btn-outline-warning btn-sm text-warning px-3 py-1 ms-2" to="/admin">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <Link className="btn btn-outline-light me-3 position-relative d-flex align-items-center" to="/cart">
                  <i className="bi bi-cart2 fs-5 me-1"></i>
                  <span className="d-none d-md-inline">Cart</span>
                  {getCartCount() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
                <div className="dropdown">
                  <button
                    className="btn btn-warning dropdown-toggle fw-semibold"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i> {user.username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="profileDropdown">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/orders">
                        <i className="bi bi-bag-check me-2"></i>My Orders
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center">
                <Link className="btn btn-outline-light me-2 px-4" to="/login">
                  Login
                </Link>
                <Link className="btn btn-warning px-4 fw-semibold" to="/register">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
