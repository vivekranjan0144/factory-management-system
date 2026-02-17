import React from 'react'
import { useSelector } from 'react-redux';

const Loginsuccess = () => {

    const login = useSelector((state) => state.login);

    console.log("Login state:", login);
  return (
    <div>
      {login.isAuthenticated ? (
        <p>Logged in as {login.message}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>

  )
}

export default Loginsuccess