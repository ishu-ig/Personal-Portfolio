const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db_connect");

const app = express();
const Router = require("./routes/index");

// Allowed Origins
const whitelist = [
  "http://devishaan.me",
  "https://devishaan.me",
  "http://www.devishaan.me",
  "https://www.devishaan.me",
  "http://localhost:3000",
  "https://localhost:3000",
  "http://api.devishaan.me",
  "https://api.devishaan.me"
];

// CORS Options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, preflight, etc.)
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked Origin:", origin);
    return callback(new Error("CORS Error: Not authorized"));
  },
  methods: "GET,POST,PUT,PATCH,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());
app.use("/public", express.static("public"));
app.use("/api", Router);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`🚀 Server running at ${port}`));
