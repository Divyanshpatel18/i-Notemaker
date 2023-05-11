import React , { useContext ,useState} from 'react'
import noteContext from '../context/notes/noteContext';


 const AddNote = (props) => {
    const context= useContext(noteContext);
    const {addNote}=context;

    const handleClick=(e)=>{
        e.preventDefault();//prevent page reload
        addNote(note.title,note.description,note.tag);// to add the title,description,tag while typing the input
        setNote({title:"",description:"",tag:""});
        props.showAlert("Added successfully","success")
    }
  
    const onChange=(e)=>{
        // change(add or overwrite) the  name and value propeties of note
        setNote({...note,[e.target.name]:e.target.value})
    }

    const [note,setNote]=useState({ id:"",title:"",description:"",tag:""});
    return (
            
            <div className="container my-3">
            <h2>Add a Note</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">title</label>
                    <input type="text" className="form-control" id="title" name="title" value={note.title} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                        
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description"  name="description" value={note.description} onChange={onChange}  minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag"  name="tag" value={note.tag} onChange={onChange}/>
                </div>
               
                <button  disabled={note.title.length<5 || note.description.length<5}  type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
            </div>
           
        
    )
}
export default AddNote