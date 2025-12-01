const express = require("express")
const cors = require("cors") 
const path = require("path")

const app = express();
app.use(cors());

app.use('/cart', express.static(path.join(__dirname, 'data/cart')));
app.use('/cats', express.static(path.join(__dirname, 'data/cats')));
app.use('/cats_products', express.static(path.join(__dirname, 'data/cats_products')));
app.use('/products', express.static(path.join(__dirname, 'data/products')));
app.use('/products_comments', express.static(path.join(__dirname, 'data/products_comments')));
app.use('/sell', express.static(path.join(__dirname, 'data/sell')));
app.use('/user_cart', express.static(path.join(__dirname, 'data/user_cart')));

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});