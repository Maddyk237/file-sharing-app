require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");

const app = express();
const fileRoutes = require("./routes/file.routes");
const userRoutes = require("./routes/user.routes");

connectDB();

app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/users", userRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.user.id,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
