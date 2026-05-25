const express = require("express");
const cors = require("cors");
require('dotenv').config();
const router = require("./router.js");

const PORT = process.env.SERVER_PORT;

const app = express();
app.use(cors());
app.use(express.json());

// INCREASE THE LIMITS HERE (e.g., up to 100 Megabytes)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.get("/", (req, res) => {
    res.send(`Doodle API is running on ${PORT}`)
})

app.get((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json(
        {
            success: false,
            message: "Something went wrong",
            error: err.message
        }

    )
})

app.use("/api/doodle", router);

app.listen(PORT, ()=>{
    console.log(`Server starting on ${PORT}`)
})