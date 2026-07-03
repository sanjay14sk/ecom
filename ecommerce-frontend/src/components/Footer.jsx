import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto border-top border-secondary">
      <div className="container text-center">
        <div className="row justify-content-center mb-3">
          <div className="col-auto">
            <span className="fw-bold fs-4 text-warning">ShopSphere</span>
          </div>
        </div>
        <p className="mb-1 text-muted">&copy; {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
        <small className="text-muted d-block">Designed with premium styles, Spring Boot & React.</small>
      </div>
    </footer>
  );
};

export default Footer;
