const mongoose = require("mongoose");
const password = "dhLFLxsFw34FqjN2o";

const url = `mongodb+srv://dhLFLxsFw34FqjN2o:${password}@rigbyjkai1.3jw5spo.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "HTML is Easy",
  date: new Date(),
  important: true,
});

note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});
