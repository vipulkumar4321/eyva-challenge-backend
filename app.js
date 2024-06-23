const express = require("express");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Supabase credentials
const supabaseUrl = "https://mgagenrgwwbwyaunslpk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYWdlbnJnd3did3lhdW5zbHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkxNDU5ODcsImV4cCI6MjAzNDcyMTk4N30.um7FTA6m_lZnQr3ExQQYfoQi2lq0GF3tzZG8lncEeg8";
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
// GET /members
app.get("/members", async (req, res) => {
  const { data, error } = await supabase.from("members").select("*");

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json({
      items: data,
      count: data.length,
    });
  }
});

// GET /members/:id
app.get("/members/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    res.status(404).json({ error: "Member not found" });
  } else {
    res.status(200).json(data);
  }
});

// POST /members
app.post("/members", async (req, res) => {
  const { name, userName, avatar, isActive, role, email, teams } = req.body;
  const { data, error } = await supabase
    .from("members")
    .insert([{ name, userName, avatar, isActive, role, email, teams }]);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(201).json({ message: "Member added successfully" });
  }
});

// PUT /members/:id
app.put("/members/:id", async (req, res) => {
  const { id } = req.params;
  const { name, userName, avatar, isActive, role, email, teams } = req.body;
  const { data, error } = await supabase
    .from("members")
    .update({ name, userName, avatar, isActive, role, email, teams })
    .eq("id", id);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json({ message: "Member updated successfully" });
  }
});

// DELETE /members/:id
app.delete("/members/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("members").delete().eq("id", id);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json({ message: "Member deleted successfully" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
