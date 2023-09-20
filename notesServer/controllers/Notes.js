const uuid = require("uuid");
const notesRouter = require("express").Router();
const Note = require("../Models/noteModel");
const User = require("../Models/userModel");

const generateId = () => {
  return uuid.v4();
};

//Obtener Datos de MongoDB
notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });

  response.json(notes);
});

//Agregar Datos a MongoDB
notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const user = await "user";

  if (!user) {
    return response.status(404).json({
      error: "Usuario no encontrado",
    });
  }

  if (body.content === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    id: generateId(),
    title: body.title,
    content: body.content,
    important: body.important || false,
    createdAt: new Date().toISOString(),
    modified: new Date().toISOString(),
    user: user._id,
  });

  const savedNote = await note.save();
  if (user.notes) {
    user.notes = user.notes.concat(savedNote._id);
  }
  if (user instanceof User) {
    await user.save();
  }
  response.json(savedNote);
});

//Obtener datos de MongoDB mediante id
notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//Borrando datos de MongoDB
notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//Editando datos de MongoDB
notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    title: body.title,
    content: body.content,
    important: body.important,
    modified: new Date(),
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
