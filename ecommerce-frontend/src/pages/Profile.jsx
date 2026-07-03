import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');

    try {
      const res = await API.put('/users/profile', {
        email,
        phone,
        address
      });
      setUser(res.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-light p-4 text-center">
              <i className="bi bi-person-circle display-4 text-warning"></i>
              <h4 className="fw-bold mt-2 mb-0">{user?.username}</h4>
              <span className="badge bg-warning text-dark text-uppercase mt-2 px-3 py-1.5 rounded-pill fs-8">
                {user?.roles?.join(', ').replace('ROLE_', '')}
              </span>
            </div>

            <div className="card-body p-5">
              {success && (
                <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>{success}</div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control bg-light rounded-3"
                    value={user?.username || ''}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control rounded-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted fw-semibold">Default Shipping Address</label>
                  <textarea
                    className="form-control rounded-3"
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-warning w-100 py-3 rounded-pill fw-bold shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
