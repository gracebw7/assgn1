import express from "express";
import cors from "cors";
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
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};
function generateID() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

app.post("/users", (req, res) => {
  try {
    const { name, job } = req.body;
    if (!name || !job) {
      return res.status(400).send("Name and job parameters are required");
    }
    const userToAdd = { id: generateID(), name, job };
    addUser(userToAdd);
    return res.status(201).send(userToAdd);
  } catch (e) {
    console.error(e);
    return res.status(400).send("Invalid request body");
  }
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found");
  } else {
    res.send(result);
  }
});

app.get("/users/:id/:job", (req, res) => {
  const id = req.params.id;
  const job = req.params.job;
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found");
  } else {
    if (result["job"] === job) {
      res.send(result);
    } else {
      res.status(404).send("Resource not found");
    }
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found");
  } else {
    users["users_list"] = users["users_list"].filter(
      (user) => user["id"] !== id
    );
    res.send(result);
  }
});

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};
