import React from 'react'
import "./generalManagerDashboard.css"
import CardSection from './CardSection'
import Sidebar from '../../Sidebar/Sidebar'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const GanaralManagerDashboard = () => {
  const auth = useSelector((state) => state.auth);
const {id}=useParams()
  return (
    <div className='layoutContainer'>
      <Sidebar id={id} role={auth?.user?.role} />
      <div className="dashboard_componant">


        <CardSection />

      </div>


    </div>
  )
}

export default GanaralManagerDashboard