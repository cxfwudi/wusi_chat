import React,{useEffect,useState} from 'react'
import styled from 'styled-components'
import Logo from '../assets/chat_logo.png'

export default function Contacts({contacts,currentUser,changeChat}) {
  //contacts获取到的好友数据
  //currentUser自己的数据
  const [currentUserName,setCurrentUserName] = useState(undefined)
  const [currentUserImage,setCurrentUserImage] = useState(undefined)
  const [currentSelected,setCurrentSelected] = useState(undefined)

  useEffect(()=>{
    
    if(currentUser){

      setCurrentUserImage(currentUser.avatarImage)
      setCurrentUserName(currentUser.username)
    }
  },[currentUser])

  const changeCurrentChat = (index,contact)=>{
    setCurrentSelected(index);
    changeChat(contact)

  }
  return (
    <div>
      {
        currentUserImage && currentUserName && (
          <Container>
            <div className="brand">
              <img src={Logo} alt="brand" />
              <h3>wusi chat</h3>
            </div>
            <div className="contacts">
              {
                contacts.map((contact,index)=>{
                  return (
                    <div className={`contact ${index === currentSelected? "selected" :""}`} key={index}
                      onClick={()=>changeCurrentChat(index,contact)}
                    >
                      <div className="avatar">
                        <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar"/>
                      </div>
                      <div className="username">
                        <h3>{contact.username}</h3>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="current-user">
              <div className="avatar">
                <img src={`data:image/svg+xml;base64,${currentUser.avatarImage}`} alt="avatar"/>
              </div>
              <div className="username">
                <h2>{currentUser.username}</h2>
              </div>
            </div>
          </Container>
        )
      }
    </div>
  )
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10vh 65vh 13.6vh;
  overflow: hidden;
  background-color: #7286D3;
  .brand{
    display: flex;
    align-items: center;
    justify-content: center;
    gap:1rem;
    img{
      height:2rem;
    }
    h3{
      color:white;
      text-transform: uppercase;
    }
  }
  .contacts{
    display:flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap:0.8rem;
    //滚动条样式
    &::-webkit-scrollbar{
      width: 0.2rem;
      &-thumb{
        background-color: #645CBB;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    /* justify-content: center; */
   
    .contact{
      background-color: #8EA7E9;
      min-height: 5rem;
      width:90%;
      cursor: pointer;
      border-radius: 0.2rem;
      padding:0.4rem;
      gap:1rem;
      align-items: center;
      display: flex;
      transition: 0.5s ease-in-out;
      .avatar{
        img{
          height:3rem;
        }
      }
      .username{
        h3{
          color: white;
        }
      }
    }
    .selected{
      background-color: #645CBB;
    }
  }
  .current-user{
    background-color: #645CBB;
    display: flex;
    justify-content: center;
    align-items: center;
    gap:2rem;
    .avatar{
      img{
        height:8vh;
        max-inline-size: 100%;
      }
    }
    .username{
      h2{
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width:1080px){
      gap:0.5rem;
      .username{
        h2{
          font-size: 1rem;
        }
      }
    } 
  }
    
  
`
