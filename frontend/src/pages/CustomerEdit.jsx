import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/customers/${id}`)
      .then(res => res.json())
      .then(data => { setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
      }); setLoading(false); })
      .catch(() => { alert("Failed to load customer"); setLoading(false); });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone) { alert("First, Last and Phone are required"); return; }
    fetch(`http://localhost:5000/api/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(res => {
      if (!res.ok) throw new Error();
      alert("Customer updated successfully");
      navigate(`/customer/${id}`);
    }).catch(() => alert("Failed to update customer"));
  };

  if (loading) return <div className="container mt-4"><p>Loading...</p></div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-3">✏️ Edit Customer</h3>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea className="form-control" name="address" value={form.address} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">City</label>
              <input className="form-control" name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">State</label>
              <input className="form-control" name="state" value={form.state} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Pin Code</label>
              <input className="form-control" name="pincode" value={form.pincode} onChange={handleChange} />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


