import React,{useState,useEffect,useRef} from 'react'
import styled from 'styled-components'
import Logout from '../components/Logout'
import ChatInput from '../components/ChatInput'
import { sendMessageRoute,getAllMessagesRoute } from '../utils/APIRoutes'
import axios from 'axios';
import {v4 as uuidv4} from "uuid"


export default function ChatContainer({currentChat,currentUser,socket}) {
  
  const [messages,setMessages] = useState([])
  const [arrivalMessage,setArrivalMessage] = useState(null)
  const scrollRef = useRef();

  const [_f,setF] = useState(0);

  useEffect(()=>{
    const token = localStorage.getItem("token")
    const getMsg = async ()=>{
      if(currentChat){
          const response = await axios.post(getAllMessagesRoute,{
            sender_id:currentUser.id,
            receiver_id:currentChat.id
          },{
            headers:{
              Authorization: `Bearer ${token}`
            }
          })
          setMessages(response.data.res_message)
      }

    }
    getMsg()
  },[currentChat])

  const handleSendMsg = (msg)=>{
    const token = localStorage.getItem("token")
    axios.post(sendMessageRoute,{
      sender:currentUser.id,
      receiver:currentChat.id,
      content:msg
    },{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    //socket
    socket.current.emit("send-msg",{
      to:currentChat.id,
      from:currentUser.id,
      message:msg,
    })
    //socket
    const msgs = [...messages];
    msgs.push({fromSelf:true,message:msg});
    setMessages(msgs)
  }


  useEffect(()=>{
    if(socket.current){
      socket.current.on("msg-receive",(msg)=>{
        //接受服务器通过socket套接字发来的信息，进行整合，调用useState之后重新渲染组件
        setArrivalMessage({fromSelf:false,message:msg})
      })
    }
  })
  
  useEffect(()=>{
    arrivalMessage && setMessages((prev)=>[...prev,arrivalMessage]);
    setF(_f + 1);
  },[arrivalMessage])

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages])

  return (
    <div>
      {
        currentChat && (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
                </div>
                <div className="username">
                  <h3>{currentChat.username}</h3>
                </div>

              </div>
              <Logout/>
            </div>
            <div className="chat-message">
              {
                messages.map((message)=>{
                  return (
                    <div ref={scrollRef} key={uuidv4()}>
                      <div className={`message ${message.fromSelf ? "sended" : "received"}`} >
                        <div className="content">
                          <p>
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <ChatInput handleSendMsg = {handleSendMsg} />
          </Container>
        )
      }
    </div>
    
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows:10% 78% 12% ;
  padding-top:1rem;
  background-color: #8EA7E9;
  gap:0.1rem;
  overflow: hidden;
  @media screen and (min-width:720px) and (max-width:1080px){
    grid-auto-rows: 15% 70% 15%;
  }
  .chat-header{
    display: flex;
    justify-content: space-between;  //上下
    align-items: center; //左右
    padding:0 2rem;
    .user-details{
      display: flex;
      align-items: center;
      gap:1rem;
      .avatar{
        img{
          height: 3rem;
        }
      }
      .username{
        h3{
          color:white;
        }
      }
    }
  }

  .chat-message{
    height: 70vh;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap:1rem;
    overflow: auto;
    &::-webkit-scrollbar{
      width:0.2rem;
      &-thumb{
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message{
      display: flex;
      align-items: center;
      .content{
        max-width: 40%;
        /* 换行 */
        overflow-wrap: break-word;
        padding: 1rem;
        font-size:1.1rem;
        border-radius: 1rem;
        color: white;
      }
    }
    .sended{
      justify-content: flex-end;
      .content{
        background-color: #645CBB;
      }
    }
    .received{
      justify-content: flex-start;
      .content{
        background-color: #645CBB;
      }
    }
  }
`
