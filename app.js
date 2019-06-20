const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors());
const ids = require("shortid");
app.set("port", process.env.PORT || 3000);

app.use(express.json());

app.locals.notes = [{
  title: "chores",
  task: "take out the trash"
}];

app.get("/api/v1/notes", (request, response) => {
  const notes = app.locals.notes;

  return response.status(200).json(notes);
});

app.get("/api/v1/notes/:id", (request, response) => {
  const { id } = request.params
  const notes = app.locals.notes;

  const note = notes.find(note => note.id == id)
  if(!note) return response.status(404).json({Error: `No note found with ${id}`})
  return response.status(200).json(note)
});

//wait to pass this when current card is generated
app.post("/api/v1/notes/", (request, response) => {
  const { notes } = app.locals;
  const { title, list } = request.body;

  if (!title || !list) return response.status(422).json('Expected format: { title: <String>, list: <StringArray> }');

  const newlist = {
    id: ids.generate(),
    title,
    list
  };

  notes.push(newlist);
  return response.status(201).json(newlist);
});

app.put("/api/v1/notes/:id", (request, response) => {

  const { title, notes } = request.body;

  let { id } = request.params;
  const foundNote =  app.locals.notes.find(note => note.id == id)

 if(!foundNote) return response.status(404).json({Error: `No note found with ${id} `})
  if(!title || !notes ) return response.status(422).json({Error: `Expected format: { title: <String>, list: <Stringarray> }`})
 
  foundNote.title = title
  foundNote.list = notes   
  return response.sendStatus(204).json(app.locals.notes)  
});

app.delete("/api/v1/notes/:id", (request, response) => {

  const { notes } = app.locals
  const { id } = request.params

  const noteIndex = notes.findIndex(note => note.id == id);
 
  if(noteIndex === -1) return response.status(404).json({Error: `No note found with ${id}`});

  notes.splice(noteIndex, 1);
  return response.sendStatus(200).json("Note was successfully deleted");

});

module.exports = app
