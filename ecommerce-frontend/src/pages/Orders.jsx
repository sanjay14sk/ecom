import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'SHIPPED': return 'bg-primary';
      case 'DELIVERED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
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
      <h2 className="fw-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="card shadow-sm border-0 rounded-4 p-5 text-center bg-light">
          <i className="bi bi-box2 display-1 text-muted"></i>
          <h4 className="fw-bold mt-3">No Orders Placed Yet</h4>
          <p className="text-muted">You haven't ordered anything yet. Head to our catalog to make your first purchase!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-dark text-light p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <span className="text-muted text-uppercase small">Order ID</span>
                  <h6 className="mb-0 fw-bold">#{order.id}</h6>
                </div>
                <div>
                  <span className="text-muted text-uppercase small">Date Placed</span>
                  <h6 className="mb-0 fw-semibold">
                    {new Date(order.orderDate).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </h6>
                </div>
                <div>
                  <span className="text-muted text-uppercase small">Total Amount</span>
                  <h6 className="mb-0 fw-extrabold text-warning">${order.totalAmount.toFixed(2)}</h6>
                </div>
                <div>
                  <span className="text-muted text-uppercase small d-block mb-1">Status</span>
                  <span className={`badge ${getStatusBadgeClass(order.status)} px-3 py-2 rounded-pill text-uppercase`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="card-body p-4">
                <h6 className="fw-bold mb-3 text-muted text-uppercase small">Items Ordered</h6>
                <div className="table-responsive">
                  <table className="table table-borderless table-align-middle mb-0">
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td style={{ width: '60px' }}>
                            <div
                              className="bg-light rounded-2 overflow-hidden d-flex align-items-center justify-content-center"
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
                          </td>
                          <td>
                            <span className="fw-bold text-dark">{item.productName}</span>
                          </td>
                          <td>
                            <span className="text-muted">Qty: {item.quantity}</span>
                          </td>
                          <td className="text-end fw-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <hr className="my-4" />
                
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h6 className="fw-bold text-muted text-uppercase small">Shipping Address</h6>
                    <p className="mb-0 text-dark small">{order.shippingAddress}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted text-uppercase small">Payment Method</h6>
                    <p className="mb-0 text-dark small">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
