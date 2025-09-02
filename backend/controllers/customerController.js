const db = require("../models/customerModel");

// Create new customer
exports.createCustomer = (req, res) => {
  const { firstName, lastName, phone, address, city, state, pincode } = req.body;
  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  db.run(
    `INSERT INTO customers (firstName, lastName, phone, address, city, state, pincode)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, phone, address || "", city || "", state || "", pincode || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: "Customer created successfully" });
    }
  );
};

// Deprecated simple listing kept for reference
// exports.getCustomersSimple = (req, res) => { ... }

// Read single customer
exports.getCustomerById = (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM customers WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
};

// Update customer
exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, address, city, state, pincode } = req.body;
  db.run(
    `UPDATE customers SET firstName=?, lastName=?, phone=?, address=?, city=?, state=?, pincode=? WHERE id=?`,
    [firstName, lastName, phone, address || "", city || "", state || "", pincode || "", id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Customer updated successfully" });
    }
  );
};

// Delete customer
exports.deleteCustomer = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM customers WHERE id=?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Customer deleted successfully" });
  });
};


exports.getCustomers = (req, res) => {
  let { page = 1, limit = 5, city, state, pincode, sortBy = "id", sortDir = "asc", includeCounts = "false" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const allowedSort = new Set(["id", "firstName", "lastName", "city", "state", "pincode"]);
  if (!allowedSort.has(sortBy)) sortBy = "id";
  sortDir = sortDir.toLowerCase() === "desc" ? "DESC" : "ASC";

  let where = " WHERE 1=1";
  const params = [];
  if (city) { where += " AND city LIKE ?"; params.push(`%${city}%`); }
  if (state) { where += " AND state LIKE ?"; params.push(`%${state}%`); }
  if (pincode) { where += " AND pincode LIKE ?"; params.push(`%${pincode}%`); }

  const countSql = `SELECT COUNT(*) as total FROM customers${where}`;
  const dataSql = `SELECT * FROM customers${where} ORDER BY ${sortBy} ${sortDir} LIMIT ? OFFSET ?`;
  const dataParams = params.concat([limit, (page - 1) * limit]);

  db.get(countSql, params, (err, countRow) => {
    if (err) return res.status(500).json({ error: err.message });
    db.all(dataSql, dataParams, (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const respond = (list) => res.json({
        data: list,
        page,
        limit,
        total: countRow.total,
        totalPages: Math.ceil(countRow.total / limit)
      });

      if (includeCounts === "true") {
        // attach address counts
        const ids = rows.map(r => r.id);
        if (ids.length === 0) return respond([]);
        const placeholders = ids.map(() => '?').join(',');
        const addrSql = `SELECT customerId, COUNT(*) as addressCount FROM addresses WHERE customerId IN (${placeholders}) GROUP BY customerId`;
        db.all(addrSql, ids, (e3, addrRows) => {
          if (e3) return res.status(500).json({ error: e3.message });
          const idToCount = Object.fromEntries(addrRows.map(r => [r.customerId, r.addressCount]));
          const enriched = rows.map(r => ({ ...r, addressCount: idToCount[r.id] || 0, onlyOneAddress: (idToCount[r.id] || 0) === 1 }));
          respond(enriched);
        });
      } else {
        respond(rows);
      }
    });
  });
};
