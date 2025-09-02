import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetch(`https://customer-crud-app1.onrender.com/api/customers/${id}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => console.error("Error fetching customer:", err));
  }, [id]);

  if (!customer) {
    return <h3 className="text-center mt-5">Loading customer details...</h3>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title">
            {customer.firstName} {customer.lastName}
          </h3>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>City:</strong> {customer.city}</p>
          <p><strong>State:</strong> {customer.state}</p>
          <p><strong>Pin Code:</strong> {customer.pincode}</p>

          <Link className="btn btn-outline-secondary me-2" to={`/customer/${id}/edit`}>Edit</Link>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
