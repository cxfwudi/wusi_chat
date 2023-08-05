import React ,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { useNavigate} from 'react-router-dom'
import {ToastContainer,toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import loader from '../assets/loader.gif'
import { Buffer } from 'buffer'
import {setAvatarRoute} from '../utils/APIRoutes'

export default function SetAvatar() {
  const api = "https://api.multiavatar.com/45678945"
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)

  const toastOptions= {
    poisition:"bottom-right",
    autoClose:8000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark"
  }

  useEffect(()=>{
    if(!localStorage.getItem("token")){
      navigate("/login")
    }
  })

  const setProfilePicture = async ()=>{
    const token = localStorage.getItem('token')
    if(selectedAvatar === undefined){
      toast.error("Please select an avatar")
    }else {
      // const user = await
      const user = await JSON.parse(localStorage.getItem("user"))
      //加token
      const {data} = await axios.post(`${setAvatarRoute}/${user.id}`,{
        image:avatars[selectedAvatar]
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(data.isSet){
        user.isAvatarImageSet = 1;
        user.avatarImage = data.image;
        localStorage.setItem("user",JSON.stringify(user))
        navigate('/')
      }else{
        toast.error("Error setting avatar.Please try again",toastOptions)
      }
    }
  }
  useEffect(()=>{
    //相当于一个钩子组件渲染之后调用
    const fetchPosts = async ()=>{
      const data = [];
      for(let i=0; i<4;i++){
        const image = await axios.get(`${api}/${Math.random() * 1000}`)
        const buffer = new Buffer(image.data)
        //使用buffer工具将图片进行base64编码
        data.push(buffer.toString("base64"))
      }
      setAvatars(data)
      setIsLoading(false)
    }
    fetchPosts()

    
  },[])

  return (
    <div>
      {
        isLoading?<Container>
          <img src={loader} alt="loader" className='loader'/>
        </Container>:(
          <Container>
            <div className="title-container">
              <h1>Pick an avatar as your propfile picture</h1>
            </div>
            <div className="avatars">
              {
                avatars.map((avatar,index)=>{
                  return (
                    <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                      {/* svg格式图片base64编码 ${avatar} 具体的base64编码后的数据 */}
                      <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" 
                      onClick={()=>setSelectedAvatar(index)}
                      // 设置选择图片的序号(数组位置)
                      />
                    </div>
                  )
                })
              }
            </div>
            <button className='submit-btn' onClick={setProfilePicture}>
              Set a Profile Picture</button>
          </Container>
        )}
      <ToastContainer></ToastContainer>
    </div>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap:3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader{
    width: 100vw;
    
  }
  .title-container{
    h1{
      color:white
    }
  }
  .avatars{
    display: flex;
    gap:2rem;
    .avatar{
      border:0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img{
        height: 6rem;
      }
    }
    .selected{
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn{
    background-color:#997af0;
    color:white;
    padding: 1rem 2rem;
    border:none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase; 
    transition: 0.5s ease-in-out;
    /*&:hover 对所选择的元素加效果  */
    &:hover{  
      background-color: #4e0eff;
    }
  }
`;
