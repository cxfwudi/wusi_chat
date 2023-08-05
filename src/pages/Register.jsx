import React ,{useState,useEffect} from 'react'
import styled from 'styled-components'

import {Link, useNavigate} from 'react-router-dom'
import Logo from '../assets/chat_logo.png'
import {ToastContainer,toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import {registerRoute} from '../utils/APIRoutes'


export default function Register() {

  const navigate = useNavigate()

  const [values,setValues] = useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:""
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
      const {password,confirmPassword,username,email} = values;
      const {data} = await axios.post(registerRoute,{
        username,
        email,
        password,
      })
      if(data.status === 1){
        toast.error(data.msg,toastOptions)
      }
      if(data.status === 0){
        toast.success(data.msg,toastOptions)
        navigate("/login")
      }
      
    }
  }
  function handleChange(event){
    setValues({...values,[event.target.name]:event.target.value})
  }

  function handleValidation(){
    const {password,confirmPassword,username,email} = values;
    if(password!==confirmPassword){
      // 提示错误插件
      toast.error("password and confirm password should be same.",toastOptions)
      return false;
    }else if(username.length<3){
      toast.error("Username should be grater than 3 characters",toastOptions)
      return false;
    }else if(password.length<6){
      toast.error("Password should be grater than 6 characters",toastOptions)
      return false;
    }else if(email === ""){
      toast.error("email is required",toastOptions)
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
          />
          <input 
            type="email" 
            placeholder='Email' 
            name='email' 
            onChange={e=>handleChange(e)}
          />
          <input 
            type="password" 
            placeholder='Password' 
            name='password' 
            onChange={e=>handleChange(e)}
          />
          <input 
            type="password" 
            placeholder='Confirm Password' 
            name='confirmPassword' 
            onChange={e=>handleChange(e)}
          />
          <button type='submit'>Create User</button>
          <span>already have an account <Link to="/login">Login</Link>
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