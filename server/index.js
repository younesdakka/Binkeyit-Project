const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config()
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/connectDB");
const userRouter = require("./router/user.route");
const  categoryRouter  = require("./router/category.route");
const  uploadRouter  = require("./router/upload.route");
const productRouter = require("./router/product.route");
const subCategoryRouter = require("./router/subCategory.route");
const orderRouter = require("./router/order.route");
const addressRouter = require("./router/address.route");
const cartRouter = require("./router/cart.route");
const app = express();


app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })

);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

app.get("/", (request, response) => {
  response.json({
    massage: " Server running successfully!",
  });
});


app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)


app.use((err, req, res ,next) => {
  console.log("Error details:", err.message)
  
  return res.status(500).json({
    status: 500,
    message: "Something went wrong, please try again later.",
    success: false
  });
})

const startServer = async () => {
  try {
    await connectDB();
    console.log(" Database connected");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  } catch (error) {
    console.error(" Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
// const connection = connectDB().then((data) => {
//   console.log(data);
//   console.log("connected");
// });


// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log("server is running", PORT);
// });
