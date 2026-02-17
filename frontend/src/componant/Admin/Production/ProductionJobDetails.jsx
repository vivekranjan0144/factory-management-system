import React from 'react'
import Sidebar from '../../Sidebar/Sidebar'
import DashboardNavBar from '../DashboardNavBar/DashboardNavBar'
import { getNavOptions, getProductionNavOptions } from '../../Navdata/dashboardNavData'
import { useParams } from 'react-router-dom'
import "./productiontargetDetails.css"
import ItemTable from '../../Table/Table'
import { Button, DatePicker, Input } from 'antd'
import { AiOutlineSearch } from 'react-icons/ai'
import dayjs from 'dayjs';
import PieChart from '../charts/PieChart'
import BarChart from './BarChart'
import StepProgress from '../charts/StepProgress'
import DoughnutChart from '../charts/DonutChart'
import { useEffect } from 'react'
import { clearError, fetchBatchesByJobId, resetWorkflowUpdate, trackWorkFlow } from '../../../features/production/productionJobSlice'
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify'



const ProductionjobDetails= () => {

  const { id } = useParams()

  const { error, loading, trackedStatus, batchesByJobId } = useSelector((state) => state.productionJobs);
  const { success, message } = trackedStatus
  const dispatch = useDispatch()
  const navOptions = getNavOptions(batchesByJobId[0]?.job?.factory_id)

  const UpdateWorkStatus = (id) => {
    // console.log(id)
    const action = 'finish'
    dispatch(trackWorkFlow({ id, action }))
  }


  useEffect(() => {
    if (error) {
      toast.error(error || "Update fail!");
      dispatch(resetWorkflowUpdate())
      dispatch(clearError())

    }
    if (success) {
      toast.success(message || "Step done successfully!");
      dispatch(fetchBatchesByJobId(id))
      dispatch(resetWorkflowUpdate())
    }



  }, [success, id, message, dispatch, error]);



  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError())

    }
    dispatch(fetchBatchesByJobId(id))
  }, [dispatch, error])



  const data = (batchesByJobId || []).map(batch => {

    return {
      key: batch.id,
      batch_id: batch.id,
      item: `${batch.product_variant?.model ?? ''} ${batch.product_variant?.kva ?? ''}kVA`,
      count: batch.quantity,
      variant: `${batch.product_variant?.kva ?? ''} kVA - PHASE ${batch.product_variant?.phase ?? ''}`,
      category: batch.product_variant?.enclosure === 'Silent' ? 'Silent Genset' : 'Open Genset',
      location: 'Assembly Line A',
      statuses: batch.statuses,
      request_by: batch.employee?.name
      // variant:batch.product_variant
    };
  });
  // console.log(batchesByJobId[0]?.job?.factory_id)





  const targetDataList = {
    targetId: '1XPL',
    unitName: '30kv-I',
    targetBatch: 4,
    startDate: '5th April 2024',
    progressData: {
      ready: 70,
      processing: 20,
      testing: 10,
    },
    status: 'processing',  // added status
  }




  const STATUS_COLORS = {
    'CNC': '#FF6384', // red / tomato
    'FABRICATION AND GRINDING': 'tomato', // red / tomato
    'POWDER COATING AND TREATMENT PLANT': '#FFCD56', // yellow
    'ENGINE AND CANOPY ASSEMBLING': '#FF9F40', // orange
    'ROCKWOOL AND FOAM FITTING': '#a78bfa', // teal
    'ELECTRICAL AND PANEL': '#36A2EB', // blue
    'TESTING': 'blue', // green
    'READY TO DISPATCH': '#4CAF50', // green
  };


  const getStatusColor = step =>
    STATUS_COLORS[step?.toUpperCase()] || '#888';



  const getArrivalTime = (statuses = []) => {
    if (!Array.isArray(statuses) || statuses.length === 0) return null;
    return statuses
      .map(s => dayjs(s.time))
      .sort((a, b) => a - b)
      .pop()
      .format('DD-MM-YYYY hh:mm A'); // 12-hour format with AM/PM
  };

  const columns = [
    {
      title: 'Batch Id',
      dataIndex: 'batch_id',
      key: 'batch_id',


    },
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      fixed: 'left',

      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            autoFocus
            placeholder="Search Name"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<AiOutlineSearch />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.item.toLowerCase().includes(value.toLowerCase()),

    },

    {
      title: 'variant',
      dataIndex: 'variant',
      key: 'variant',

      filters: [...new Set(data.map(item => item.variant))].map(id => ({ text: String(id), value: id })),
      onFilter: (value, record) => record.variant === value,
    },
    {
      title: 'count',
      dataIndex: 'count',
      key: 'count',
      filterMultiple: false,
      filters: [
        { text: 'Low to High', value: 'asc' },
        { text: 'High to Low', value: 'desc' }
      ],
      onFilter: () => true,
    },
    {
      title: 'Arrival Time',
      dataIndex: 'statuses',
      key: 'arrivalTime',
      render: (_, record) => getArrivalTime(record.statuses),
      sorter: (a, b) =>
        dayjs(getArrivalTime(a.statuses)).unix() -
        dayjs(getArrivalTime(b.statuses)).unix(),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <DatePicker
            autoFocus
            value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
            onChange={(date, dateString) =>
              setSelectedKeys(dateString ? [dateString] : [])
            }
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<AiOutlineSearch />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        dayjs(getArrivalTime(record.statuses)).isSame(dayjs(value), 'day'),
    },

    {
      title: 'Status',
      dataIndex: 'statuses',
      key: 'status',
      filters: [...new Set(data.map(r => r.statuses.at(-1)?.status))]
        .map(status => ({ text: status, value: status })),
      onFilter: (value, record) => record.statuses.at(-1)?.status === value,
      render: (statuses) => {
        const latest = statuses?.length ? statuses.at(-1).status.toUpperCase() : 'Not Started';
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '0 8px',
              borderRadius: 4,
              background: getStatusColor(latest),
              color: '#fff',
              fontWeight: 500,
            }}
          >
            {latest}
          </span>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Button loading={loading} onClick={() => UpdateWorkStatus(record.key)} style={{
          background: 'none',
          borderColor: '#4CAF50',
          borderWidth: '1px',
          padding: '5px',
          fontSize: '10px',
          color: '#4CAF50',
          fontWeight: "bold"
        }} type="primary" >
          Finish step
        </Button>
      ),
    },
  ];


  // --- last-step counts (unchanged) ---
  const lastSteps = data.map(d => d.statuses.at(-1)?.status.toUpperCase() || 'Not Stared');
  const stepCounts = lastSteps.reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1; return acc;
  }, {});
  //  const labels = Object.keys(variantCountMap);    
  //   const values = Object.values(variantCountMap);  

  // Count quantities per unique variant
  const variantCountMap = data.reduce((acc, item) => {
    const variantKey = item.variant;
    if (!variantKey) {
      console.warn('Missing product_variant for item:', item);
      return acc;  // skip this item
    }


    acc[variantKey] = (acc[variantKey] || 0) + item.count;
    return acc;
  }, {});

  // Prepare labels and data points
  const labels = Object.keys(variantCountMap); // Variant names
  const dataPoints = Object.values(variantCountMap); // Corresponding quantities


  // Generate some distinct colors for each variant
  const backgroundColors = labels.map((_, i) => {
    // For example, pick colors from a preset palette or generate random colors:
    const presetColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return presetColors[i % presetColors.length];
  });

  const doughnutChartData = {
    labels: labels,
    datasets: [
      {
        label: 'No of Batch',
        data: dataPoints,
        backgroundColor: backgroundColors,
      },
    ],
  };


  const pieChartData = {
    labels: Object.keys(stepCounts),
    datasets: [
      {
        label: 'No of Batch',
        data: Object.values(stepCounts),
        backgroundColor: Object.keys(stepCounts).map(getStatusColor), // <- here
      },
    ],
  };
  const barData = {
    labels: Object.keys(stepCounts),
    datasets: [
      {
        label: 'Time Taken',
        data: Object.values(stepCounts),
        backgroundColor: Object.keys(stepCounts).map(getStatusColor), // <- here
      },
    ],
  };



  const options = {
    plugins: {
      legend: {
        display: true, // This hides the label
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawOnChartArea: false, // removes background grid lines
        },
        ticks: {
          stepSize: 1, // Y-axis steps of 10
          font: {
            size: 10,
          },
        }
      },
      x: {
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          display: false,                  // ⬅️ turn off x-axis labels
        },

      },

    },
  };



  const ExpandedRowContent = ({ record }) => {

    const allSteps = ['CNC', 'FABRICATION AND GRINDING', 'POWDER COATING AND TREATMENT PLANT', 'ENGINE AND CANOPY ASSEMBLING', 'ROCKWOOL AND FOAM FITTING', 'ELECTRICAL AND PANEL', 'TESTING', 'READY TO DISPATCH'];

    return (
      <div className="custom-expanded-row" key={record.key}>
        <h1 style={{ margin: '10px', color: 'green' }}>{record.batch_id}</h1>

        <StepProgress direction={'vertical'} allSteps={allSteps} record={record} />

      </div>
    );
  };



  return (

    <div className='layoutContainer'>
      <Sidebar />



      <div className="storedetailscomponant">
        <DashboardNavBar navOptions={navOptions} />

        <div className="dashboard_componant">
          <div className="Targetheader"><h3>{`JOB-${batchesByJobId[0]?.job_id}`}</h3><span>{targetDataList.startDate}</span></div>
          <div className="tableAndGrapgdiv">
            <ItemTable columns={columns} data={data} renderExpandedRow={(record) => <ExpandedRowContent record={record} />} />
            <div className="workDetailsCharts">

              <div>
                <PieChart data={pieChartData} />
              </div>
              <div  >

                <DoughnutChart doughnutdata={doughnutChartData} title="Batch GEN-SET-2002" />
                {/* <DoughnutChart  labels={labels} values={values} title="Batch GEN-SET-2002" /> */}
              </div>
              <div>

                <BarChart options={options} data={barData} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductionjobDetails
