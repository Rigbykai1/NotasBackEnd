const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  createdAt: Date,
  modified: Date,
  important: Boolean,
  isDone: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
