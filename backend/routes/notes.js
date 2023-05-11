const express = require('express');
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
//ROUTE 1
// GEt all the notes GET "/api/notes/getallnotes" login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }

})

//ROUTE 2
// add a new note using addnote :POST "/api/notes/addnote" login required
router.post('/addnote', fetchuser, [
    // applying validation
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        //if there are errors return bad request and error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const saveNote = await note.save();
        res.json(saveNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})

//ROUTE 3
// update the existing notes PUT "/api/notes/updatenote/:id" login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
 
      const {title,description,tag}=req.body;
      try {
        
      //create a newNote object
      const newNote={};
      if(title){newNote.title=title};
      if(description){newNote.description=description};
      if(tag){newNote.tag=tag};

      // Find the note to be updated
      let note= await Note.findById(req.params.id);
      if(!note){
     return   res.status(404).send("Not Found")};

        //check whether the user accessing to his own note only
     if(note.user.toString() !== req.user.id){
    return  res.status(401).send("Not Allowed")};
     
        //updating the note
        note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
       res.json({note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})

//ROUTE 4
// Deleting the note: DELETE "/api/notes/deletenote/:id" login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
        try{
    // Find the note to deleted
    let note= await Note.findById(req.params.id);
    if(!note){
     return res.status(404).send("Not Found")};

      //check whether the user accessing to his own note only
   if(note.user.toString() !== req.user.id){
    return  res.status(401).send("Not Allowed")};
   
      //deleting  the note
      note=await Note.findByIdAndDelete(req.params.id)
      res.json({"Success": "note has been deleted",note:note});
      
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
})
module.exports = router;