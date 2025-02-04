import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userModel from "./models/user.js";

dotenv.config();
const { MONGO_CONNECTION_STRING } = process.env;
mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const findUserByName = (name) => {
  return userModel.find({ name: name });
};

const findUserById = (id) => {
  return userModel.findById(id);
};

const addUser = (user) => {
  const userToAdd = new userModel(user);
  return userToAdd.save();
};

app.post("/users", async (req, res) => {
  try {
    const { name, job } = req.body;
    if (!name || !job) {
      return res.status(400).send("Name and job parameters are required");
    }
    const userToAdd = { name, job };
    const newUser = await addUser(userToAdd);
    return res.status(201).send(newUser);
  } catch (e) {
    console.error(e);
    return res.status(400).send("Invalid request body");
  }
});

app.get("/users", async (req, res) => {
  const name = req.query.name;
  try {
    let result;
    if (name) {
      result = await findUserByName(name);
    } else {
      result = await userModel.find(); // Fetch all users if no name is specified
    }
    res.send({ users_list: result });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching users");
  }
});

// GET: Fetch a specific user by ID
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await findUserById(id);
    if (!result) {
      res.status(404).send("Resource not found");
    } else {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching user");
  }
});

// GET /users?name=<name>&job=<job> to fetch users by matching both name and job
app.get("/users", async (req, res) => {
  const { name, job } = req.query;
  try {
    let result;
    if (name && job) {
      // Fetch users by both name and job
      result = await userModel.find({ name: name, job: job });
    } else if (name) {
      // Fetch users by name only
      result = await findUserByName(name);
    } else if (job) {
      // Fetch users by job only
      result = await findUserByJob(job);
    } else {
      // Fetch all users if no filters are applied
      result = await userModel.find();
    }
    res.send({ users_list: result });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching users");
  }
});

// DELETE /users/:id to remove a user, given their id
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await userModel.findByIdAndDelete(id);
    if (!result) {
      res.status(404).send("Resource not found");
    } else {
      res.status(204).send({ message: "Resource deleted", user: result });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting user");
  }
});

// GET: Fetch user by name and job
app.get("/users/:name/:job", async (req, res) => {
  const { name, job } = req.params;
  try {
    const result = await findUserByName(name);
    if (!result || result[0]?.job !== job) {
      res.status(404).send("Resource not found");
    } else {
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching user");
  }
});
