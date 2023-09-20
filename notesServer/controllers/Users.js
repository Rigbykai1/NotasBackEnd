const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../Models/userModel");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("notes", {
    content: 1,
    important: 1,
  });
  response.json(users);
});

// PUT route
usersRouter.put("/:id", async (request, response) => {
  const { username, name, password } = request.body;
  const id = request.params.id;

  const user = await User.findById(id);
  if (!user) {
    return response.status(404).json({
      error: "Usuario no encontrado",
    });
  }

  user.username = username;
  user.name = name;
  if (password) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    user.passwordHash = passwordHash;
  }

  await user.save();

  response.status(200).json(user);
});

// GET by ID route
usersRouter.get("/:id", async (request, response) => {
  const id = request.params.id;

  const user = await User.findById(id).populate("notes", {
    content: 1,
    important: 1,
  });
  if (!user) {
    return response.status(404).json({
      error: "Usuario no encontrado",
    });
  }

  response.json(user);
});

// DELETE route
usersRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return response.status(404).json({
      error: "Usuario no encontrado",
    });
  }
});

module.exports = usersRouter;
