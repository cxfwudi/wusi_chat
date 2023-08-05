import React ,{useState,useEffect} from 'react'
import styled from 'styled-components'

import {Link, useNavigate} from 'react-router-dom'
import Logo from '../assets/chat_logo.png'
import {ToastContainer,toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import {loginRoute} from '../utils/APIRoutes'


export default function Login() {

  const navigate = useNavigate()

  const [values,setValues] = useState({
    username:"",
    password:"",
    
  })

  const toastOptions= {
    poisition:"bottom-right",
    autoClose:8000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark"
  }

  async function  handleSubmit(event){
    event.preventDefault();
    if(handleValidation()){
      const {password,username} = values;
      const {data} = await axios.post(loginRoute,{
        username,
        password,
      })
      if(data.status === 1){
        toast.error(data.msg,toastOptions)
      }
      if(data.status === 0){
        localStorage.setItem('user',JSON.stringify(data.user))
        localStorage.setItem('token',data.token)
        navigate("/")
      }
      
    }
  }
  function handleChange(event){
    setValues({...values,[event.target.name]:event.target.value})
  }

  function handleValidation(){
    const {password,username} = values;
    if(password === ""){
      // 提示错误插件
      toast.error("password can't be empty",toastOptions)
      return false;
    }else if(username.length === ""){
      toast.error("Username is required",toastOptions)
      return false;
    }
    return true;
  }

  return (
    <div>
      <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
          <div className='brand'>
            <img src={Logo} alt="Logo" />
            <h1>WUSI CHAT</h1>
          </div>
          <input 
            type="text" 
            placeholder='Username' 
            name='username' 
            onChange={e=>handleChange(e)}
            min="3"
          />
          
          <input 
            type="password" 
            placeholder='Password' 
            name='password' 
            onChange={e=>handleChange(e)}
          />
          
          <button type='submit'>Login In</button>
          <span>Don't have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer/>
    </div>
  )
}

const FormContainer = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:1rem;
  align-items:center;
  background-color:#131324;
  .brand{
    display:flex;
    align-items:center;
    gap:1rem;
    justify-content:center;
    img{
      height:5rem;
    }
    h1{
      color:white;
      text-transform:uppercase
    }
  }
  form{
    display:flex;
    flex-direction:column;
    gap:2rem;
    background-color:#00000076;
    border-radius:2rem;
    padding:3rem 5rem;
    input{
      background-color:transparent;
      padding:1rem;
      border:0.1rem solid #4e0eff;
      border-radius:0.4rem;
      color:white;
      width:100%;
      font-size:1rem;
      &:focus{
        border:0.1rem solid #997af0;
        outline:none;
    }
  }
  button{
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
  span{
    color: white;
    text-transform: uppercase;
    a{
      color: #4e0eff;
      text-transform: none;
      text-decoration: none;
      font-weight: bold;
    }
  };
`
