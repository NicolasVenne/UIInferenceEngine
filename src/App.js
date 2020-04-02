import React, {useState, useRef, useEffect} from 'react';
import logo from './logo.svg';
import Prompt from './components/Prompt';
import { ask, onPrompt, onReply, onEndConvo } from './services/InferenceEngine';
import './App.css';
import Reply from './components/Reply';
import FontAwesome from 'react-fontawesome';
import Select from './components/Select';

function App() {

  const [anim, setAnim] = useState(false);
  const btnState = useRef("arrow");
  const [btnUpdate, setButtonUpdate] = useState();
  const [animMsg, setAnimMsg] = useState(-1);
  const [messages, setMessages] = useState([{type: "input", message: "What are your symptoms?"}]);
  const endScrollRef = useRef(null) 
  const currentInputRef = useRef();
  const promptCallback = useRef(null);

  function click() {
    if(currentInputRef.current.value !== "") {
      console.log("Im asking");
      btnState.current = "thinking";
      ask(currentInputRef.current.value);

    }
    
  }

  function prompt() {
    if(promptCallback.current instanceof Function) {
      if(currentInputRef.current.value !== "") {
        promptCallback.current(currentInputRef.current.value);
        btnState.current = "thinking";
        setButtonUpdate(btnState.current)
      }
      
    }
  }

  function reply() {
    btnState.current = "arrow";
    setButtonUpdate(btnState.current)

    addMessage({type: "input", message: "What are your symptoms?"});
  }

  function getBtnFunction() {
    switch(btnState.current) {
      case "replying": reply(); break;
      case "arrow": click();break;
      case "prompt": prompt();break;
      case "select": prompt();break;
      default: return;
    }
  }

  function addMessage(message) {
    setAnimMsg(messages.length - 1);
    messages.push(message)

    setMessages(messages);
    setAnim(true);
    setTimeout(() => {
      setAnim(false);
    }, 1200)
    if(message.type === "input") {
      setTimeout(() => {
        currentInputRef.current.focus();

      }, 500)
    }
  }

  useEffect(() => {
    btnState.current = "arrow"
    setButtonUpdate(btnState.current)
    onPrompt((message, callback) => {
      if(message.type === "input") {
        btnState.current = "prompt";
      } else if(message.type === "select") {
        btnState.current = "select";
      }
      setButtonUpdate(btnState.current)

      addMessage(message)
      promptCallback.current = callback;
    }) 

    onEndConvo(() => {
      btnState.current = "arrow";
      setButtonUpdate(btnState.current)
      addMessage({type: "input", message: "What are your symptoms?"});
    })

    onReply((message) => {
      console.log(message);
      addMessage({type: "reply", message: "I think you may have...", data: message});
      btnState.current = "replying"
      setButtonUpdate(btnState.current)

    })

    document.addEventListener("keydown", enterKey, false);


  }, [])//Init

  function enterKey(event) {
    if(event.keyCode  == 13) {
      getBtnFunction();
    }
  }

  useEffect(() => {
    const scrollHeight = endScrollRef.current.scrollHeight;
    const height = endScrollRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    setTimeout(() => {
      endScrollRef.current.scroll({
        top: maxScrollTop > 0 ? maxScrollTop : 0,
        behavior: "smooth"
      })
    }, 250)
  }, )
  return (
    <div className="container">
      <div className="container-column" ref={endScrollRef}>
        <div className="margin-fix"></div>

        {messages.map((msg, index) => {
          if(msg.type === "input") {
            return <Prompt key={index} title={msg.message} animate={animMsg === index}
            incoming={messages.length - 1 === index} msg={messages.length - 1 === index ? "Im thinking" : ""} 
            inputRef={messages.length - 1 === index ? currentInputRef : null}></Prompt>
          } else if(msg.type === "reply") {
            return <Reply key={index} title={msg.message} animate={animMsg === index}
            incoming={messages.length - 1 === index} diagnosis={msg.data}></Reply>
          } else if(msg.type === "select") {
            return <Select key={index} title={msg.message} 
            animate={animMsg === index}
            incoming={messages.length - 1 === index}
            inputRef={messages.length - 1 === index ? currentInputRef : null} 
            options={msg.options}
            onSelect={getBtnFunction}></Select>
          }
        })}
        <div className="scroll-fix" ></div>
      </div>
      <button onClick={getBtnFunction} className={`${anim ? "animation" : ""} ${btnUpdate}`} disabled={btnUpdate === "select"}></button>

    </div>
  );
}

export default App;
