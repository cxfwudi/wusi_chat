import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import jwt_decode from "jwt-decode";

import  {io}  from "socket.io-client";

export default function Chat() {
  const socket = useRef(); //???????????????
  const [contacts, setContacts] = useState([]);
  //记录自己
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  //记录当前聊天对象
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  const verifyToken = (token) => {
    const decodedToken = jwt_decode(token);

    // 获取 Token 的过期时间（exp 字段）
    const expirationTime = decodedToken.exp;

    // 获取当前时间的时间戳（秒数）
    const currentTime = Math.floor(Date.now() / 1000);

    // 检查 Token 是否过期
    if (expirationTime < currentTime) {
      // Token 已过期
      navigate("/login");
    } else {
      // Token 未过期
      console.log("Token 未过期");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      verifyToken(localStorage.getItem("token"));
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
      setIsLoaded(true);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //socket
    if (currentUser) {
      // socket.current = io("http://localhost:5000");
      socket.current = io("http://www.wusi.fun:5002");
      socket.current.emit("add-user", currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    const getUser = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    getUser();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          // 传递对方/自己
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  background-color: #06283d;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #ffe7cc;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
