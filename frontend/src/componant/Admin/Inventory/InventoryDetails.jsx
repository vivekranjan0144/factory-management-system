import React from 'react'
import InventoryTable from '../Inventory/InventoryTable'
import Sidebar from '../../Sidebar/Sidebar'
import DashboardNavBar from '../DashboardNavBar/DashboardNavBar'
import {getNavOptions} from '../../Navdata/dashboardNavData'
import StockAnalasysSection from '../charts/StockAnalasysSection'
import { useParams } from 'react-router-dom'

const InventoryDetails = () => {
    const {id} = useParams()
    const navOptions=getNavOptions(id)
    return (
        <div className='layoutContainer'>
            <Sidebar />
            <div className="dashboardContainerLayout">

                <DashboardNavBar  navOptions={navOptions}/>
                <StockAnalasysSection/>
                <InventoryTable />
            </div>
        </div>
    )
}

export default InventoryDetails