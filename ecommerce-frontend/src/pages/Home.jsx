import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [cartFeedback, setCartFeedback] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, page, sortBy, sortDir]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/products?page=${page}&size=6&sortBy=${sortBy}&sortDir=${sortDir}`;
      if (selectedCategory) url += `&categoryId=${selectedCategory}`;
      if (search) url += `&search=${search}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;

      const res = await API.get(url);
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('id');
    setSortDir('asc');
    setPage(0);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to your cart');
      return;
    }
    const res = await addToCart(productId, 1);
    if (res.success) {
      setCartFeedback((prev) => ({ ...prev, [productId]: 'Added!' }));
      setTimeout(() => {
        setCartFeedback((prev) => ({ ...prev, [productId]: null }));
      }, 1500);
    } else {
      alert(res.message);
    }
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      alert('Please login to manage your wishlist');
      return;
    }
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <div className="container py-4">
      {/* Hero Banner */}
      <div className="p-5 mb-4 bg-dark text-light rounded-4 shadow-sm border border-secondary position-relative overflow-hidden banner-gradient">
        <div className="container-fluid py-3 position-relative z-1">
          <h1 className="display-5 fw-bold text-gradient">Discover ShopSphere</h1>
          <p className="col-md-8 fs-5 text-muted">
            Explore premium selected products, custom categories, dynamic search, and high-performance ordering systems built to amaze.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="card shadow-sm border-0 rounded-3 p-4 bg-light">
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <i className="bi bi-funnel me-2 text-warning"></i> Filters
            </h5>
            
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control rounded-start-3"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-warning rounded-end-3">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted">Category</label>
              <select
                className="form-select rounded-3"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(0);
                }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-muted">Price Range</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control rounded-3"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control rounded-3"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-dark btn-sm w-100 mt-2 rounded-3"
                onClick={() => {
                  setPage(0);
                  fetchProducts();
                }}
              >
                Apply Range
              </button>
            </div>

            <button className="btn btn-outline-danger w-100 rounded-3 text-uppercase fw-bold fs-7" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="text-muted fw-medium">{totalElements} Products found</span>
            
            <div className="d-flex align-items-center gap-2">
              <span className="text-nowrap text-muted small">Sort By</span>
              <select
                className="form-select form-select-sm rounded-3 px-3"
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDir(dir);
                  setPage(0);
                }}
              >
                <option value="id-asc">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-box-seam display-1 text-muted"></i>
              <p className="fs-5 text-muted mt-3">No products match your filters.</p>
            </div>
          ) : (
            <>
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {products.map((p) => (
                  <div key={p.id} className="col">
                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card position-relative">
                      {/* Wishlist toggle */}
                      <button
                        className="btn btn-light shadow-sm rounded-circle position-absolute top-0 end-0 m-3 z-2 d-flex align-items-center justify-content-center p-2"
                        onClick={() => handleWishlistToggle(p.id)}
                        style={{ width: '38px', height: '38px' }}
                      >
                        <i className={`bi ${isInWishlist(p.id) ? 'bi-heart-fill text-danger' : 'bi-heart'} fs-5`}></i>
                      </button>

                      {/* Stock badge */}
                      {p.stock === 0 ? (
                        <span className="position-absolute top-0 start-0 m-3 badge bg-danger z-2 px-3 py-2 rounded-pill text-uppercase">Out Of Stock</span>
                      ) : p.stock <= 5 ? (
                        <span className="position-absolute top-0 start-0 m-3 badge bg-warning text-dark z-2 px-3 py-2 rounded-pill text-uppercase">Low Stock ({p.stock})</span>
                      ) : null}

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
                              <i className="bi bi-image fs-1"></i>
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
                          <h5 className="card-title fw-bold text-truncate mb-2">{p.name}</h5>
                        </Link>
                        <p className="card-text text-muted small text-truncate-2 mb-3">{p.description}</p>
                        
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className="fs-4 fw-extrabold text-dark">${p.price.toFixed(2)}</span>
                          <button
                            className={`btn ${cartFeedback[p.id] ? 'btn-success' : 'btn-warning'} px-3 rounded-pill fw-semibold shadow-sm d-flex align-items-center gap-1`}
                            onClick={() => handleAddToCart(p.id)}
                            disabled={p.stock === 0}
                          >
                            <i className={`bi ${cartFeedback[p.id] ? 'bi-check2' : 'bi-cart-plus'} fs-5`}></i>
                            <span>{cartFeedback[p.id] || 'Add'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-5 d-flex justify-content-center">
                  <ul className="pagination shadow-sm rounded-3">
                    <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                      <button className="page-link py-2.5 px-3" onClick={() => setPage(page - 1)}>
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${page === index ? 'active' : ''}`}>
                        <button className="page-link py-2.5 px-3" onClick={() => setPage(index)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                      <button className="page-link py-2.5 px-3" onClick={() => setPage(page + 1)}>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
