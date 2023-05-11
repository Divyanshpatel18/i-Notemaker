import React, { useContext, useEffect, useRef,useState } from 'react'
import NoteItem from './NoteItem'
import noteContext from '../context/notes/noteContext';
import AddNote from './AddNote';
import {  useNavigate} from 'react-router-dom'

const Notes = (props) => {
    const context = useContext(noteContext);
    
    const { notes, getNotes,editNote } = context;
    const [note,setNote]=useState({id:"",etitle:"",edescription:"",etag:""});
       
    const ref = useRef(null);
    //useRef hook used to manipulate DOM,it has current object
    const refClose = useRef(null);

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag})
       
    }
//e refers to edit note attribute
    const handleClick=(e)=>{
        editNote(note.id,note.etitle,note.edescription,note.etag)
        refClose.current.click();
        props.showAlert("updated successfully","success")

    }
  
    const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value})
    }

    let navigate=useNavigate();


    //getting all the notes after sign in is done,using useffect to load notes only once
    useEffect(() => {
        
        if(localStorage.getItem('token')){
               getNotes();
            // eslint-disable-next-line 
        }else{
            navigate("/login");
        }
       
    }, [])
    


    return (
        <>
            <AddNote showAlert={props.showAlert} />

            <button  ref={ref} type="button" className="btn btn-primary d-none " data-bs-toggle="modal" data-bs-target="#exampleModal" >
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal"  tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                                    {/* //min length is required */}

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription"  value={note.edescription }onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange}  />
                                </div>

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" ref={refClose} data-bs-dismiss="modal">Close</button>
                            <button   disabled={note.etitle.length<5 || note.edescription.length<5}  type="button" className="btn btn-primary" onClick={handleClick}>update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h2>Your Notes</h2>
                <div className="container mx-2">
                { notes.length===0 && 'No notes to display'}
                </div>
                {
                    notes.map((note) => {
                        return <NoteItem  showAlert={props.showAlert} key={note._id} updateNote={updateNote} note={note} />
                    })
                }
            </div>
        </>
    )
}
export default Notes