import express from "express";
import pg from "pg";
import cors from "cors";
import * as dotenv from 'dotenv'

// Setting up the server
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

dotenv.config();

// Connect the server to the database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "NoteKeeperDB",
    password: process.env.DB_PASSWORD,
    port: 5432
});
db.connect();

// App routes

// Get all the notes
app.get("/", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM Notes");
        res.json(results.rows);
    } catch (err) {
        console.log(err);
    }
});

// Create a new Note
app.post("/Notes", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = await db.query("INSERT INTO Notes (title, content) VALUES ($1, $2)", 
            [title, content]);
        res.json(newNote);
    } catch (err) {
        console.log(err);
    }
});

//Delete a note
app.delete("/Notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const results = await db.query("DELETE FROM Notes WHERE id = " + id);
        res.json("Note Deleted");
    } catch (err) {
        console.log(err);
    }
});


app.listen(port, () => {
    console.log('Server running on port ' + port);
});