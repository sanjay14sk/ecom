import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, totalUsers: 0, totalProducts: 0 });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Form states for Category
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Form states for Product
  const [prodId, setProdId] = useState(null); // null means adding, number means editing
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, catRes, prodRes, orderRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/categories'),
        API.get('/products?size=1000'), // load all for management
        API.get('/orders/all')
      ]);

      setStats(statsRes.data);
      setCategories(catRes.data);
      setProducts(prodRes.data.content);
      setOrders(orderRes.data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  // CATEGORY OPERATIONS
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', { name: newCatName, description: newCatDesc });
      setNewCatName('');
      setNewCatDesc('');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  // PRODUCT OPERATIONS
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await API.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProdImageUrl(res.data.imageUrl);
    } catch (err) {
      alert('Failed to upload image file');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const productPayload = {
      name: prodName,
      description: prodDesc,
      price: parseFloat(prodPrice),
      stock: parseInt(prodStock),
      categoryId: parseInt(prodCatId),
      imageUrl: prodImageUrl
    };

    try {
      if (prodId) {
        await API.put(`/products/${prodId}`, productPayload);
      } else {
        await API.post('/products', productPayload);
      }
      resetProductForm();
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEditProduct = (p) => {
    setProdId(p.id);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price);
    setProdStock(p.stock);
    setProdCatId(p.categoryId);
    setProdImageUrl(p.imageUrl || '');
    // Scroll to form
    window.scrollTo({ top: document.getElementById('productForm').offsetTop - 100, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const resetProductForm = () => {
    setProdId(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdStock('');
    setProdCatId('');
    setProdImageUrl('');
    setImageFile(null);
  };

  // ORDER OPERATIONS
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status?status=${status}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
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

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0 text-dark">Admin Management Portal</h2>
        <button className="btn btn-outline-dark rounded-pill px-4" onClick={fetchDashboardData}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 text-center bg-primary text-light h-100">
            <h6 className="text-uppercase tracking-wider small text-white-50">Total Revenue</h6>
            <h2 className="fw-extrabold mt-2 mb-0">${stats.totalSales.toFixed(2)}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 text-center bg-dark text-light h-100">
            <h6 className="text-uppercase tracking-wider small text-muted">Orders Placed</h6>
            <h2 className="fw-extrabold mt-2 mb-0">{stats.totalOrders}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 text-center bg-warning text-dark h-100">
            <h6 className="text-uppercase tracking-wider small text-dark-50">Registered Users</h6>
            <h2 className="fw-extrabold mt-2 mb-0">{stats.totalUsers}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 p-4 text-center bg-light text-dark h-100">
            <h6 className="text-uppercase tracking-wider small text-muted">Active Products</h6>
            <h2 className="fw-extrabold mt-2 mb-0">{stats.totalProducts}</h2>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-pills nav-fill mb-5 shadow-xs bg-light p-2.5 rounded-4 border border-light-subtle">
        <li className="nav-item">
          <button className={`nav-link py-3 rounded-3 fw-bold ${activeTab === 'overview' ? 'active bg-dark text-light' : 'text-muted'}`} onClick={() => setActiveTab('overview')}>
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link py-3 rounded-3 fw-bold ${activeTab === 'products' ? 'active bg-dark text-light' : 'text-muted'}`} onClick={() => setActiveTab('products')}>
            Products Management
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link py-3 rounded-3 fw-bold ${activeTab === 'categories' ? 'active bg-dark text-light' : 'text-muted'}`} onClick={() => setActiveTab('categories')}>
            Categories Management
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link py-3 rounded-3 fw-bold ${activeTab === 'orders' ? 'active bg-dark text-light' : 'text-muted'}`} onClick={() => setActiveTab('orders')}>
            Orders Tracking
          </button>
        </li>
      </ul>

      {/* TABS VIEW CONTENT */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="card shadow-sm border-0 rounded-4 p-5 bg-light text-center">
          <i className="bi bi-speedometer2 display-2 text-warning"></i>
          <h3 className="fw-bold mt-3">Welcome to ShopSphere Admin</h3>
          <p className="text-muted col-md-6 mx-auto">
            Use the navigation controls above to manage active inventories, create custom categories, upload product images, and track shipping workflow statuses of user purchases.
          </p>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="row g-5">
          {/* Add / Edit Form */}
          <div className="col-lg-4" id="productForm">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-light">
              <h4 className="fw-bold mb-4">{prodId ? 'Edit Product' : 'Add New Product'}</h4>
              
              <form onSubmit={handleSaveProduct}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Product Name</label>
                  <input type="text" className="form-control rounded-3" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
                </div>
                
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea className="form-control rounded-3" rows="3" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} required></textarea>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small fw-semibold">Price ($)</label>
                    <input type="number" step="0.01" className="form-control rounded-3" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small fw-semibold">Stock Quantity</label>
                    <input type="number" className="form-control rounded-3" value={prodStock} onChange={(e) => setProdStock(e.target.value)} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Category</label>
                  <select className="form-select rounded-3" value={prodCatId} onChange={(e) => setProdCatId(e.target.value)} required>
                    <option value="">Choose category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Product Image</label>
                  <input type="file" className="form-control rounded-3" accept="image/*" onChange={handleImageUpload} />
                  {uploadingImage && <div className="text-warning small mt-1">Uploading...</div>}
                  {prodImageUrl && (
                    <div className="mt-2 text-success small text-truncate">
                      Uploaded: <a href={`http://localhost:8080${prodImageUrl}`} target="_blank" rel="noreferrer">{prodImageUrl}</a>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-warning w-100 py-2.5 rounded-3 fw-bold shadow-sm">
                    {prodId ? 'Update Product' : 'Add Product'}
                  </button>
                  {prodId && (
                    <button type="button" className="btn btn-outline-dark py-2.5 rounded-3" onClick={resetProductForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Products List */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="ps-4">Product Info</th>
                      <th scope="col">Category</th>
                      <th scope="col">Price</th>
                      <th scope="col">Stock</th>
                      <th scope="col" className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded overflow-hidden me-3" style={{ width: '50px', height: '50px' }}>
                              {p.imageUrl ? (
                                <img src={p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:8080${p.imageUrl}`} alt="" className="img-fluid object-fit-cover w-100 h-100" />
                              ) : (
                                <i className="bi bi-image text-muted small"></i>
                              )}
                            </div>
                            <div>
                              <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: '180px' }}>{p.name}</span>
                              <small className="text-muted">ID: #{p.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>{p.categoryName}</td>
                        <td className="fw-semibold">${p.price.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${p.stock === 0 ? 'bg-danger' : p.stock <= 5 ? 'bg-warning text-dark' : 'bg-success'} rounded-pill`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="text-end pe-4 py-3">
                          <button className="btn btn-link text-primary me-2 p-0" onClick={() => handleEditProduct(p)}>
                            <i className="bi bi-pencil-square fs-5"></i>
                          </button>
                          <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteProduct(p.id)}>
                            <i className="bi bi-trash-fill fs-5"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="row g-5">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-light">
              <h4 className="fw-bold mb-4">Add Category</h4>
              <form onSubmit={handleCreateCategory}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Category Name</label>
                  <input type="text" className="form-control rounded-3" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea className="form-control rounded-3" rows="3" value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-warning w-100 py-2.5 rounded-3 fw-bold shadow-sm">
                  Create Category
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="ps-4">ID</th>
                      <th scope="col">Category Name</th>
                      <th scope="col">Description</th>
                      <th scope="col" className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id}>
                        <td className="ps-4 py-3 text-muted">#{c.id}</td>
                        <td className="fw-bold text-dark">{c.name}</td>
                        <td className="text-muted small">{c.description || 'No description'}</td>
                        <td className="text-end pe-4">
                          <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteCategory(c.id)}>
                            <i className="bi bi-trash-fill fs-5"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Order ID</th>
                  <th scope="col">Date Placed</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Shipping Address</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-4">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="ps-4 py-4 fw-bold">#{o.id}</td>
                    <td className="small text-muted">
                      {new Date(o.orderDate).toLocaleDateString()}
                    </td>
                    <td className="fw-extrabold text-dark">${o.totalAmount.toFixed(2)}</td>
                    <td className="small text-truncate" style={{ maxWidth: '200px' }}>{o.shippingAddress}</td>
                    <td>
                      <span className={`badge px-3 py-1.5 rounded-pill text-uppercase fs-8 ${
                        o.status === 'PENDING' ? 'bg-warning text-dark' :
                        o.status === 'SHIPPED' ? 'bg-primary' :
                        o.status === 'DELIVERED' ? 'bg-success' : 'bg-danger'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <select
                        className="form-select form-select-sm rounded-3 d-inline-block w-auto"
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
