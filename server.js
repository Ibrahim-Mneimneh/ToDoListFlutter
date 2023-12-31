const mongoose = require("mongoose");
const express = require("express");
const { verifyUser } = require("./Middleware/UserAuth");
dotenv = require("dotenv");
userRoutes = require("./Routes/user");
taskRoutes = require("./Routes/task");
authRoutes = require("./Routes/userAuth");
const app = express();

dotenv.config();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api", authRoutes);
app.use(verifyUser);
app.use("/api/task", taskRoutes);

mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Successfully connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});
