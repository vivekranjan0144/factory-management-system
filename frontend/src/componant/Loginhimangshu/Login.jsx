import React, { useEffect, useState } from 'react'
import "./login.css"
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
// import { login } from '../../actions/user'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../features/auth/authSlice'
// import { useAlert } from 'react-alert'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

const navigate=useNavigate()


  const submitHandler = (e) => {
    dispatch(loginUser({ email, password }))
    // dispatch(login(email, password))
    e.preventDefault();



  };
useEffect(() => {
    if (auth.user) {
      if (auth.user.role === 'admin') {
        navigate('/admin-dashboard');
      } 
      if (auth.user.role === 'store manager') {
        navigate(`/details/${auth.user.factory_id}`);
      } 
      else {
        navigate(`/production/job/${auth.user.factory_id}`)
      }
    }
  }, [auth.user, navigate]);

  return (
    <div className="login">
      <div className="logincontainer">
        <form action="" onSubmit={submitHandler} className="loginForm">
          <Typography variant='h4'>
            <p>A</p>
            <p>D</p>
            <p>M</p>
            <p>I</p>
            <p style={{ marginRight: "1vmax" }}>N</p>
            <p>P</p>
            <p>A</p>
            <p>N</p>
            <p>E</p>
            <p>L</p>

          </Typography>

          <div>
            <input type="email"
              placeholder='Admin Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' variant='contained'>Login</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login