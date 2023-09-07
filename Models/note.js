const mongoose = require("mongoose");

mongoose.set('strictQuery', false)

const password = "dhLFLxsFw34FqjN2o";
const url = `mongodb+srv://dhLFLxsFw34FqjN2o:${password}@rigbyjkai1.3jw5spo.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

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

module.exports = mongoose.model("note", noteSchema);
