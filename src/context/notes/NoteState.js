import React, { useState } from "react";

import NoteContext from "./noteContext";
const host = "http://localhost:5000"
const NodeState = (props) => {

    const notesInitial = [];
    const [notes, setNotes] = useState(notesInitial)

    //fetch all notes
    let getNotes = async () => {
          
            //API CALL
            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
             
            });
            const json= await response.json();
            setNotes(json);
    }



    // Add a Note
    const addNote = async (title, description, tag) => {
        // TODO API CALL     
            //API CALL
            try {
                
           
            const response = await fetch(`${host}/api/notes/addnote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token')
                },
                
                // this body format is same which we mentioned in backend api
                //the arguements passed from addnote in AddNote.js is received here in parameters and sent below in json.stringify
                body: JSON.stringify({title,description,tag})
            });
          
           const json=await response.json();
           setNotes(notes.concat(json)) //concat returns a array while push updates an array
        } catch (error) {
                console.log(error);
        }
        }
           
       

    // Delete a Note
   

    const deleteNote = async (id) => {
         //API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            
        });

        const json = response.json();
        //filter returns an array, filter takes an arrow function
        //notes(array which is calling it) each values of notes is assgined to note(parameter) and in fuction definition  condition is checked ,it will return the data wich satifies condition else not return if not satisfied
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
    }

    // Edit a Note
    const editNote = async (id, title, description, tag) => {
        //API CALL
        //this syntax in mentioned in official mdn site
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
         
            },
            body: JSON.stringify({title,description,tag})
        });
        const json =  await response.json();

        //we cannot change state directly in react therefore create newNote
        let newNotes= (JSON.parse(JSON.stringify(notes)))
        //json parse to create deep copy

        //Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }


    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, setNotes,getNotes }}>
            {props.children}
        </NoteContext.Provider>

    )
}

export default NodeState;