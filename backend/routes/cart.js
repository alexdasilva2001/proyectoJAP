const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "No hay items en el carrito" });
    }

    // Crear carrito vacío
    const [cartRes] = await db.query("INSERT INTO carts () VALUES ()");
    const cartId = cartRes.insertId;

    // Insertar productos asociados
    for (const item of items) {
      await db.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cartId, item.product_id, item.quantity]
      );
    }

    res.json({ ok: true, cartId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error guardando el carrito" });
  }
});

module.exports = router;