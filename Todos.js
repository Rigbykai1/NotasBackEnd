const express = require("express");
const app = express();
const cors = require("cors");
const todos = require("./Models/todo");
const uuid = require("uuid");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("build"));

app.get("/api/todos", (req, res) => {
  todos.find({}).then((todos) => {
    res.json(todos);
  });
});

const generateId = () => {
  return uuid.v4();
};

app.post("/api/todos", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const todo = new todos({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  });

  todo.save().then((savedTask) => response.json(savedTask));
});

app.get("/api/todos/:id", (request, response, next) => {
  todos
    .findById(request.params.id)
    .then((todo) => {
      if (todo) {
        response.json(todo);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/todos/:id", (request, response) => {
  todos
    .findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  const todo = {
    content: body.content,
    important: body.important,
  };

  todos
    .findByIdAndUpdate(request.params.id, todo, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
