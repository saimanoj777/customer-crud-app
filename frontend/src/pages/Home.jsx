import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [filters, setFilters] = useState({ city: "", state: "", pincode: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);

  const load = () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortDir,
      includeCounts: "true",
    });
    if (filters.city) params.append("city", filters.city);
    if (filters.state) params.append("state", filters.state);
    if (filters.pincode) params.append("pincode", filters.pincode);

    fetch(`http://localhost:5000/api/customers?${params.toString()}`)
      .then(res => res.json())
      .then(resp => {
        const list = Array.isArray(resp) ? resp : resp.data;
        setCustomers(list || []);
        setTotalPages(resp.totalPages || 1);
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        alert("Failed to load customers");
      });
  };

  useEffect(() => {
    load();
  }, [page, limit, sortBy, sortDir]);

  const confirmDelete = () => {
    fetch(`http://localhost:5000/api/customers/${deleteId}`, { method: "DELETE" })
      .then(res => {
        if (res.ok) {
          setCustomers(customers.filter(c => c.id !== deleteId));

          // close modal
          const modalEl = document.getElementById("deleteModal");
          const modal = window.bootstrap.Modal.getInstance(modalEl);
          modal.hide();

          setDeleteId(null);
        }
      })
      .catch(err => console.error("Delete failed:", err));
  };

  return (
    <div className="container mt-4">
      {/* Welcome Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <h3 className="card-title">👋 Welcome to Customer Manager</h3>
          <p className="card-text text-muted">
            Manage customers and their addresses with ease.
          </p>
          <Link to="/create" className="btn btn-primary">
            + Add New Customer
          </Link>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label">City</label>
              <input className="form-control" value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">State</label>
              <input className="form-control" value={filters.state} onChange={e => setFilters({ ...filters, state: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Pincode</label>
              <input className="form-control" value={filters.pincode} onChange={e => setFilters({ ...filters, pincode: e.target.value })} />
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-primary me-2" onClick={() => { setPage(1); load(); }}>Search</button>
              <button className="btn btn-outline-secondary" onClick={() => { setFilters({ city: "", state: "", pincode: "" }); setPage(1); load(); }}>Clear</button>
            </div>
          </div>

          <div className="row g-2 mt-3">
            <div className="col-md-3">
              <label className="form-label">Sort By</label>
              <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="id">ID</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="city">City</option>
                <option value="state">State</option>
                <option value="pincode">Pincode</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Direction</label>
              <select className="form-select" value={sortDir} onChange={e => setSortDir(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Per Page</label>
              <select className="form-select" value={limit} onChange={e => setLimit(parseInt(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end justify-content-end">
              <Link to="/create" className="btn btn-success">+ Add New Customer</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Customers List */}
      {customers.length === 0 ? (
        <div className="alert alert-info text-center">
          No customers found. Start by creating a new one.
        </div>
      ) : (
        <div className="list-group shadow-sm">
          {customers.map(customer => (
            <div
              key={customer.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>
                  {customer.firstName} {customer.lastName}
                </strong>
                <br />
                <small className="text-muted">{customer.phone}</small>
                {typeof customer.addressCount !== "undefined" && (
                  <>
                    <br />
                    <small className="text-muted">Addresses: {customer.addressCount} {customer.onlyOneAddress && <span className="badge text-bg-info ms-1">Only One Address</span>}</small>
                  </>
                )}
              </div>
              <div>
                <Link
                  to={`/customer/${customer.id}`}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  View
                </Link>
                <Link
                  to={`/customer/${customer.id}/edit`}
                  className="btn btn-sm btn-outline-secondary me-2"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-outline-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  onClick={() => setDeleteId(customer.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {/* Delete Modal */}
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body text-center">
              <p>Are you sure you want to delete this customer?</p>
              <button
                className="btn btn-secondary me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
