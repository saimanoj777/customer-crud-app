import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressList from "../components/AddressList";

function CustomerProfile() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    axios.get(`https://customer-crud-app1.onrender.com/api/customers/${id}`).then((res) => {
      setCustomer(res.data);
    });
  }, [id]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="card shadow p-4">
      <h3 className="mb-3">Customer Profile</h3>
      <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
      <p><strong>Phone:</strong> {customer.phone}</p>
      <p><strong>City:</strong> {customer.city}</p>
      <p><strong>State:</strong> {customer.state}</p>
      <p><strong>Pincode:</strong> {customer.pincode}</p>

      <AddressList customerId={id} />
    </div>
  );
}

export default CustomerProfile;
