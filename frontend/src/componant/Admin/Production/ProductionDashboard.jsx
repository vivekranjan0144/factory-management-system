import React, { useEffect } from 'react'
import Sidebar from '../../Sidebar/Sidebar'
import './productiondashboard.css'
import TargetCard from './TargetCard'
// import { ProductionnavOptions } from '../../Navdata/dashboardNavData'
import DashboardNavBar from '../DashboardNavBar/DashboardNavBar'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearUpdateStatus, fetchProductionTargets } from '../../../features/production/productionTargetSlice'
import { getNavOptions, getProductionNavOptions } from '../../Navdata/dashboardNavData'
import { toast } from 'react-toastify'


const ProductionDashboard = () => {
const dispatch=useDispatch()
const auth = useSelector((state) => state.auth);

const {id} =useParams();
const navOptions = getNavOptions(id)
 const { targets, loading, error ,update} = useSelector((state) => state.productionTargets);

const targetDataList = loading || error ? [] : targets.map(target => {
  const items = target.items ?? [];
  
  return {
    id: target.id,
    targetId: `TGT-${target.id}`,
    unitName: items[0]?.product_variant?.product?.name ?? 'N/A',
    // targetBatch: target.job_info?.batch_count ?? 0,
    startDate: new Date(target.createdAt).toLocaleDateString(),

    progressData: {
      ready: items.length, // Number of variants (items count)
      processing: items.reduce((sum, item) => sum + (item.quantity ?? 0), 0), // Total quantity
      // testing: 0,
    },
 progressSections: [
    { label: 'Varient', key: 'ready', color: 'orange' },
    { label: 'Unit', key: 'processing', color: 'yellow' },
    // { label: 'Ready', key: 'ready', color: 'green' },
  ],

    status: target.status_info?.status,
  };
});



useEffect(() => {
  if(update?.message){
  toast.success(update?.message|| "Target updated successfully!");
dispatch(clearUpdateStatus())

}
if(error){
    toast.success(error|| "Target updated fail!");
dispatch(clearUpdateStatus())
  }
 dispatch(fetchProductionTargets(id))
}, [dispatch,id,update?.message,error])

  return (


    <div className='layoutContainer'>
      <Sidebar id={id} role={auth?.user?.role} />


      {/* <div className='navlayout'> */}

      <div className="storedetailscomponant">
        <DashboardNavBar navOptions={navOptions} />

        <div className="dashboard_componant">
          <div className="targetSection">

            {targetDataList && targetDataList.map((item) => (
                <TargetCard item={item} />
             
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductionDashboard