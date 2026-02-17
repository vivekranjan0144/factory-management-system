import React, { useEffect } from 'react'
import DashboardNavBar from '../DashboardNavBar/DashboardNavBar'
import Sidebar from '../../Sidebar/Sidebar'
import StockAnalasysSection from '../charts/StockAnalasysSection'
import { getNavOptions } from '../../Navdata/dashboardNavData'
import ItemTable from '../../Table/Table'
import { AiOutlineOrderedList } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFinishedGoods, fetchFinishedGoodsFactory } from '../../../features/Inventory/finishGoodSlice'
import { useParams } from 'react-router-dom'

const FinishGoodsFactory = () => {
    const {id}=useParams()
    const auth = useSelector((state) => state.auth);
    
  const dispatch = useDispatch()
const navOptions=getNavOptions(id)
  // Grab finished goods slice state
  const { FactoryGoods, loading, error } = useSelector((state) => state.finishGoods)

  useEffect(() => {
    dispatch(fetchFinishedGoodsFactory(id))
  }, [dispatch])

  // Transform finished goods data for table
  const data = FactoryGoods?.map((item) => ({
    key: item.finished_good_id,
    finished_good_id: item.finished_good_id,
    job_id: item.job_id ?? '-',
    name: item.variant.product?.name ?? '-',
    quantity: item.quantity,
    completion_date: item.completion_date,
    variant_model: item.variant?.model ?? '-',
    variant_phase: item.variant?.phase ?? '-',
    variant_voltage: item.variant?.voltage ?? '-',
    variant_fuel_type: item.variant?.fuel_type ?? '-',
    variant_sku: item.variant?.sku ?? '-',
  })) || []

  const columns = [
    {
      title: 'Finished Good ID',
      dataIndex: 'finished_good_id',
      key: 'finished_good_id',
      fixed: 'left',
    },
    // {
    //   title: 'Job ID',
    //   dataIndex: 'job_id',
    //   key: 'job_id',
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Completion Date',
      dataIndex: 'completion_date',
      key: 'completion_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Variant Model',
      dataIndex: 'variant_model',
      key: 'variant_model',
    },
    {
      title: 'Phase',
      dataIndex: 'variant_phase',
      key: 'variant_phase',
    },
    {
      title: 'Voltage',
      dataIndex: 'variant_voltage',
      key: 'variant_voltage',
    },
    {
      title: 'Fuel Type',
      dataIndex: 'variant_fuel_type',
      key: 'variant_fuel_type',
    },
    {
      title: 'SKU',
      dataIndex: 'variant_sku',
      key: 'variant_sku',
    },
  ]

  return (
    <div className="layoutContainer">
      <Sidebar id={id} role={auth?.user?.role} />

      <div className="dashboardContainerLayout">
        <DashboardNavBar navOptions={navOptions} />

        <StockAnalasysSection />

        <div className="storeDetailsTable">
          <h3 className="h3Header">
            <AiOutlineOrderedList /> Finished Goods List
          </h3>

          {loading && <p>Loading finished goods...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          <ItemTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}

export default FinishGoodsFactory
