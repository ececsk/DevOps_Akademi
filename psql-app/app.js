"use strict";
const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "host.docker.internal",//host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432,
});
const app = express();

// Veritabanı bağlantısını kontrol et eğer bağlantı başarılıysa students tablosunu oluştur
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection error:", err);
  } 
  else {
    console.log("Database connected");
    // Tablo oluşturma sorgusu
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        midterm_grade INTEGER NOT NULL,
        final_grade INTEGER NOT NULL
      )`;

    client.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating table:", err);
      } else {
        console.log("Table created successfully");
      }
    });
    release();
  }
});

// Tüm öğrencileri getirme
app.get("/students", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM students");
    res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}); 

// Öğrenci ekleme (POST)
app.post("/students/insert/:name/:midterm_grade/:final_grade", (req, res) => {
  const { name, midterm_grade, final_grade } = req.params;
  const query = "INSERT INTO students(name, midterm_grade, final_grade) VALUES ($1, $2, $3)";
  pool.query(query, [name, midterm_grade, final_grade], (err, results) => {
    if (err) {
      console.error("Database query error: ", err);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    } else {
      console.log("Data inserted successfully");
      res.status(200).json({
        status: "success",
        data: results.rows,
      });
    }
  });
});
//öğrenci ekleme GET 
app.get("/students/insert/:name/:midterm_grade/:final_grade", (req, res) => {
  const { name, midterm_grade, final_grade } = req.params;
  const query = "INSERT INTO students(name, midterm_grade, final_grade) VALUES ($1, $2, $3)";
  pool.query(query, [name, midterm_grade, final_grade], (err, results) => {
    if (err) {
      console.error("Database query error: ", err);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    } else {
      console.log("Data inserted successfully");
      res.status(200).json({
        status: "success",
        message: "Data inserted successfully",
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
