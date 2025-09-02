const db = require("../models/customerModel");

// Create new address for a customer
exports.createAddress = (req, res) => {
  const { customerId, address, city, state, pincode } = req.body;
  if (!customerId || !address) {
    return res.status(400).json({ error: "CustomerId and Address are required" });
  }

  db.run(
    `INSERT INTO addresses (customerId, address, city, state, pincode)
     VALUES (?, ?, ?, ?, ?)`,
    [customerId, address, city, state, pincode],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: "Address added successfully" });
    }
  );
};

// Get all addresses of a customer
exports.getAddressesByCustomer = (req, res) => {
  const { customerId } = req.params;
  db.all(`SELECT * FROM addresses WHERE customerId = ?`, [customerId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Update address
exports.updateAddress = (req, res) => {
  const { id } = req.params;
  const { address, city, state, pincode } = req.body;
  db.run(
    `UPDATE addresses SET address=?, city=?, state=?, pincode=? WHERE id=?`,
    [address, city, state, pincode, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Address updated successfully" });
    }
  );
};

// Delete address
exports.deleteAddress = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM addresses WHERE id=?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Address deleted successfully" });
  });
};
