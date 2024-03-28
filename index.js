const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/db");

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/assignment")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

app.get("/product", async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/product", async (req, res) => {
  try {
    const productData = req.body;
    const product = await Product.create(productData);

    // Calculate and set the offer for the newly created product
    const mrp = product.price.mrp;
    const specialPrice = product.price.specialPrice;
    const discountPercentage = ((mrp - specialPrice) / mrp) * 100;
    product.offer = `${discountPercentage.toFixed(2)}% off`;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/product/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProductData = req.body;

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatedProductData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate and set the offer for the updated product
    const mrp = updatedProduct.price.mrp;
    const specialPrice = updatedProduct.price.specialPrice;
    const discountPercentage = ((mrp - specialPrice) / mrp) * 100;
    updatedProduct.offer = `${discountPercentage.toFixed(2)}% off`;

    await updatedProduct.save(); // Save the product with the updated offer

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});