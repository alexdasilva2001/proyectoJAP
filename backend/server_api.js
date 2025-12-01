const express = require("express");
const cors = require("cors");

const app = express();
const cartRoutes = require("./routes/cart");

app.use(cors());
app.use(express.json());

// endpoint carrito
app.use("/cart", cartRoutes);

app.listen(3001, () => {
  console.log("API escuchando en http://localhost:3001");
});