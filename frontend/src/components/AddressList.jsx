import { useEffect, useState } from "react";
import axios from "axios";

function AddressList({ customerId }) {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const loadAddresses = async () => {
    const res = await axios.get(`https://customer-crud-app1.onrender.com/api/addresses/${customerId}`);
    setAddresses(res.data);
  };

  useEffect(() => {
    loadAddresses();
  }, [customerId]);

  const addAddress = async () => {
    if (!newAddress) return;
    await axios.post("https://customer-crud-app1.onrender.com/api/addresses", {
      customerId,
      address: newAddress,
    });
    setNewAddress("");
    loadAddresses();
  };

  const startEdit = (addr) => { setEditingId(addr.id); setEditingText(addr.address); };
  const cancelEdit = () => { setEditingId(null); setEditingText(""); };
  const saveEdit = async () => {
    if (!editingId) return;
    await axios.put(`https://customer-crud-app1.onrender.com/api/addresses/${editingId}`, { address: editingText });
    cancelEdit();
    loadAddresses();
  };
  const removeAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    await axios.delete(`https://customer-crud-app1.onrender.com/api/addresses/${id}`);
    loadAddresses();
  };

  return (
    <div className="card shadow p-3 mt-3">
      <h5 className="mb-3">Addresses</h5>
      <ul className="list-group mb-3">
        {addresses.map((a) => (
          <li key={a.id} className="list-group-item d-flex align-items-center justify-content-between">
            <div className="flex-grow-1 me-2">
              {editingId === a.id ? (
                <input className="form-control" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
              ) : (
                a.address
              )}
            </div>
            <div className="text-nowrap">
              {editingId === a.id ? (
                <>
                  <button className="btn btn-sm btn-primary me-2" onClick={saveEdit}>Save</button>
                  <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => startEdit(a)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeAddress(a.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
        {addresses.length === 0 && <li className="list-group-item text-muted">No addresses found</li>}
      </ul>
      <div className="input-group">
        <input
          className="form-control"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Enter new address"
        />
        <button className="btn btn-success" onClick={addAddress}>Add</button>
      </div>
    </div>
  );
}

export default AddressList;
