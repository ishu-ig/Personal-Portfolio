const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();              // ✅ Load env first
require("./db_connect");                // ✅ Connect to DB

const app = express();
const Router = require("./routes/index");

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

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS Error: Not authorized'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/public", express.static("public"));
app.use("/api", Router);

// Serve React frontend
// app.use("", express.static(path.join(__dirname, "client/build")));
// app.get("/*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});