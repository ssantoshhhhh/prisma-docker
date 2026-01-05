require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const app = express();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  const decoded = jwt.verify(token, "SECRET_KEY");
  req.userId = decoded.userId;
  next();
};


// Create Prisma client with adapter
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(express.json());

// Create Task
app.post("/tasks", async (req, res) => {
  const task = await prisma.task.create({
    data: { title: req.body.title },
  });
  res.json(task);
});

// Get All Tasks
app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

app.post("/tasks", auth, async (req, res) => {
  const task = await prisma.task.create({
    data: {
      title: req.body.title,
      userId: req.userId
    }
  });
  res.json(task);
});


// Update Task
app.put("/tasks/:id", async (req, res) => {
  const task = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: { completed: req.body.completed },
  });
  res.json(task);
});

// Delete Task
app.delete("/tasks/:id", async (req, res) => {
  await prisma.task.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ message: "Task deleted" });
});

app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: hashed
    }
  });

  res.json(user);
});


app.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email }
  });

  if (!user) return res.status(401).json({ message: "Invalid email" });

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ userId: user.id }, "SECRET_KEY");
  res.json({ token });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
