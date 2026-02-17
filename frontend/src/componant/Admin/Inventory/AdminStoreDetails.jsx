import React from 'react'
import "./AdminStoreDetails.css"
import Sidebar from '../../Sidebar/Sidebar'
import DashboardNavBar from '../DashboardNavBar/DashboardNavBar'
import InventoryTable from '../Inventory/InventoryTable'
// import {navOptions} from "../../Navdata/dashboardNavData"
import { getNavOptions } from '../../Navdata/dashboardNavData'

import StockAnalasysSection from '../charts/StockAnalasysSection'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminStoreDetails = () => {
  const { id } = useParams()
  const auth = useSelector((state) => state.auth);
  
  
  // console.log(id)
  const navOptions = getNavOptions(id)

  return (
    <div className='layoutContainer'>
      <Sidebar id={id} role={auth?.user?.role} />

      {/* <div className='navlayout'> */}

      <div className="storedetailscomponant">
        <DashboardNavBar navOptions={navOptions} />



        <StockAnalasysSection />
        <InventoryTable />

        {/* </div> */}
      </div>
    </div>
  )
}

export default AdminStoreDetails