import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch} from 'react-redux'
import { loginUser } from '../../../_action/user_actioin';
import { useNavigate } from 'react-router-dom';
//import { withRouter } from 'react-router-dom';
function LoginPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value)
  }
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value)
  }
  const onSubmitHandler = (e) => {
    e.preventDefault();
    let body = {
      email: Email,
      password: Password
    }
    dispatch(loginUser(body))
    //axios.post('/api/users/login', body)
         .then(response => {
           if(response.payload.loginSuccess){
             navigate('/')
           }else{
             alert('Error')
           }
         })
  }
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{
        display: 'flex', flexDirection: 'column'
      }}
       onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler}/>
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler}/>
        <br/>
        <button>
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage