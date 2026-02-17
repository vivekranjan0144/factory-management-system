import React, { useEffect } from 'react'
import Sidebar from '../../Sidebar/Sidebar'
import './ProductionActive.css'
import TargetCard from './TargetCard'
import { getNavOptions, getProductionNavOptions } from '../../Navdata/dashboardNavData'
import DashboardNavBar from '../DashboardNavBar/DashboardNavBar'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductionTargets } from '../../../features/production/productionTargetSlice'
import { fetchAllJobs } from '../../../features/production/productionJobSlice'


const ProductionActive = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth);

const {id} = useParams();
// const ProductionnavOptions = getProductionNavOptions(id)
const navOptions=getNavOptions(id)


  const { jobs, loading, error } = useSelector((state) => state.productionJobs);


const targetDataList = loading || error ? [] : jobs.map(target => {
  const batches = Array.isArray(target.batches) ? target.batches : [];

  // Extract latest status step of each batch (normalized to lowercase)
  const latestSteps = batches.map(batch => {
    const statuses = Array.isArray(batch.statuses) ? batch.statuses : [];
    if (statuses.length === 0) return 'lineup';
    return statuses[statuses.length - 1].status.toLowerCase();
  });

  // Count occurrences of each unique latest step
  const stepCounts = latestSteps.reduce((acc, step) => {
    acc[step] = (acc[step] || 0) + 1;
    return acc;
  }, {});

  // Prepare bar chart data
  const labels = Object.keys(stepCounts);
  const data = labels.map(label => stepCounts[label]);

  const backgroundColor = labels.map(() => 'rgba(255, 0, 0, 0.6)'); // One color per bar

 return {
  id: target.job_id,
  targetId: `TGT-${target.job_id}`,
  unitName: batches[0]?.product_variant?.model || batches[0]?.product_variant?.sku || 'N/A',
  targetBatch: batches.length,
  startDate: new Date(target.createdAt).toLocaleDateString(),

  progressData: {
    lineup: latestSteps.filter(s => s === 'lineup').length,
    ready: latestSteps.filter(s => s === 'ready to dispatch').length,
    processing: latestSteps.filter(s => 
      ['cnc', 'fabrication and grinding', 'assembly', 'welding'].includes(s)
    ).length,
  },

  progressSections: [
    { label: 'Line Up', key: 'lineup', color: 'orange' },
    { label: 'Processing', key: 'processing', color: 'yellow' },
    { label: 'Ready', key: 'ready', color: 'green' },
  ],

  barChartData: {
    labels,
    datasets: [
      {
        label: 'Batch Count by Latest Step',
        data,
        backgroundColor,
      }
    ]
  },

  // status: target.status_info?.status ?? 'pending',
};

});

  useEffect(() => {
    dispatch(fetchAllJobs(id))
  }, [dispatch,id])

  return (


    <div className='layoutContainer'>
   
      <Sidebar id={id} role={auth?.user?.role} />


      {/* <div className='navlayout'> */}

      <div className="storedetailscomponant">
        <DashboardNavBar navOptions={navOptions} />

        <div className="dashboard_componant">
          <div className="targetSection">

            {targetDataList && targetDataList.map((item) => (
              <TargetCard key={item.id} type={'activejob'} item={item} />

            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductionActive