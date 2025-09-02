import { useState } from "react";
import axios from "axios";

function CustomerForm({ onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://customer-crud-app1.onrender.com/api/customers", form);
      alert("✅ Customer created successfully!");
      setForm({ firstName: "", lastName: "", phone: "", city: "", state: "", pincode: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("❌ Error creating customer");
    }
  };

  return (
    <div className="card shadow p-3 mb-4">
      <h5 className="mb-3">Add New Customer</h5>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <input className="form-control" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="city" placeholder="City" value={form.city} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="state" placeholder="State" value={form.state} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
        </div>
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
