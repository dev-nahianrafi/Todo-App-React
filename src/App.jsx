import { useEffect, useState } from "react";
import { getDatabase, ref, set, push, onValue, remove, update} from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


function App() {
  let [text, settext] =useState("")
  let [todos, settodos] = useState([])
  let [btn, setbtn] = useState(true)
  let [alinfo, setallinfo] = useState({})

  const db = getDatabase();

  let handletext = (e) =>{
    settext(e.target.value);
  }

  // write korsi

  let handleclick = () =>{
    if(text !== ""){
      set(push(ref(db, 'alltodo')), {
        mytext: text,
      }).then(()=>{
        toast('🦄 Create Successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          settext("")
      });
    }else{
      toast.error(' Enter Something', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  }

  // read
  useEffect(()=>{
    const todoappRef = ref(db, 'alltodo');
    onValue(todoappRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item)=>{
        arr.push({...item.val(), id: item.key})
      })
      settodos(arr)
    });
  },[])

  // delete oparation
  let handledelete = (deleteid) =>{
    remove(ref(db, "alltodo/" + deleteid)).then(()=>{
      toast.error('🦄 Delete Successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    })
  }
  // edit
  let handleedit = (editinfo) => {
    setbtn(false)
    settext(editinfo.mytext);
    setallinfo(editinfo);
  }

  let handleupdate = () => {
    update(ref(db, "alltodo/" + alinfo.id),{
      mytext : text
    }).then(()=>{
      toast('🦄 Edit Successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      settext("")
      setbtn(true)
    })
    // console.log(editinfo.id);
    
  }


  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
{/* Same as */}
<ToastContainer />

      <div className="container">
        <div className="main_div">
            <div className="left_div">
                <h2>Make Your day awsome with todo app</h2>
            </div>
            <div className="Right_div">
                <div className="menubar">
                    <h2>ToDo</h2>
                </div>
                <div className="inputs">
                    <input onChange={handletext} value={text} name="text" className="inputboxx" type="text" placeholder="Enter Your Text"/>
                    {btn
                      ?
                      <button onClick={handleclick} className="submit">Add</button>
                      :
                      <button onClick={handleupdate} className="submit">Update</button>
                    }
                </div>
                <div>
                <ul className="main">
                  {todos.map((item, index)=>(
                    <li key={index}>{item.mytext} 
                    <div className="icons">
                    <i onClick={() => handleedit(item)} className="fa-solid fa-pen-to-square"></i>
                    <i onClick={()=>handledelete(item.id)} className="fa-solid fa-trash"></i>
                    </div>
                    </li>
                  ))
                  }
                    
                </ul>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default App
