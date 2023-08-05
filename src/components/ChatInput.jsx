import React,{useState} from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react'
import {IoMdSend} from "react-icons/io"
import {BsEmojiSmileFill} from 'react-icons/bs'

export default function ChatInput({handleSendMsg}) {
  const [showEmojiPicker,setShowEmojiPicker] = useState(false);
  const [msg,setMsg] = useState("");



  const handleEmojiPickerHideShow = ()=>{
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (event,emoji)=>{
    let message = msg;
    message += event.emoji;
    setMsg(message)
  }

  const sendChat = (event)=>{
    event.preventDefault();
    if(msg.length > 0){
      handleSendMsg(msg);
      setMsg('')
    }
  }

  return (
    <Container>
      <div className='button-container'>
        <div className='emoji'>
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
          {
            showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} width="300" theme='dark'/>
          }
        </div>
      </div>
      <form className='input-container' onSubmit={(e)=>sendChat(e)}>
        <input type="text" 
        placeholder='type your message here'
        value={msg}
        //简单双向绑定
         onChange={(e)=>setMsg(e.target.value)}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  )
}
const Container = styled.div`
  display: grid;
  margin-top: 0.3rem;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #1C3879;
  padding:0 2rem;
  padding-top: 1rem;
  /* padding-bottom: 0.3rem; */
  @media screen and (min-width:720px) and (max-width:1080px){
    padding: 0 1rem;
    gap:1rem;
  }
  .button-container{
    display: flex;
    align-items: center;
    color:white;
    gap:1rem;
    .emoji{
      position: relative;
      svg{
        font-size: 1.5rem;
        color:#ffff00c7;
        cursor: pointer;
      }
      //设置表情框的位置
      .EmojiPickerReact {
        /* width: 10vw; */
        position: absolute;
        top:-1650%;
        background-color: #1C3879;
        border: 0.2rem outset #9186f3;
        .epr-body::-webkit-scrollbar{
          background-color: #080420;
          width: 5px;
          &-thumb{
            background-color: #9186f3;
          }
        }
      }
    }
  }
  .input-container{
    width:100%;
    border-radius: 2rem;
    display: flex;
    align-content: center;
    gap:2rem;
    background-color: #ffffff34;
    input{
      width:90%;
      border: none;
      /* height: 60%; */
      background-color: transparent;
      color: #f8f5f5;
      padding-left: 1rem;
      
      font-size: 1.2rem;
      &::selection{
        background-color: #9186f3;
      }
      &:focus{
        outline: none;
      }
    }
    button{
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border:none;
      @media screen and (min-width:720px) and (max-width:1080px){
        padding: 0.3rem 1rem;
        svg{
          font-size: 1rem;
        }
      }
      svg{
        font-size: 2rem;
        color: white;
      }
    }
  }
`