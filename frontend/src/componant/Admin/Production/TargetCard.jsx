// TargetCard.js
import React from 'react';
import './targetcard.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Button, Typography } from "antd";
import BarChart from './BarChart';
import { MdAddLink, MdCloudCircle, MdDone } from 'react-icons/md';
import { AiFillClockCircle, AiOutlineClockCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductionTargets, fetchProductionTargetsUpdate } from '../../../features/production/productionTargetSlice';

const { Title } = Typography;
const TargetCard = ({ type, item }) => {

  const auth = useSelector((state) => state.auth);
 const { targets, loading, error ,update} = useSelector((state) => state.productionTargets);


  const dispatch = useDispatch();
  // console.log(item)
  const hendelReject = (id) => {
    const data = {
      status: 'rejected',
      production_user_id: auth?.user?.employee_id, // or get it from context/state
    };

    dispatch(fetchProductionTargetsUpdate({ id, data }))
     dispatch(fetchProductionTargets(targets[0]?.factory_id))
    
  }
  const hendelApprove = (id) => {
    const data = {
      status: 'approved',
      production_user_id: auth?.user?.employee_id, // or get it from context/state
    };

    dispatch(fetchProductionTargetsUpdate({ id, data }))
     dispatch(fetchProductionTargets(targets[0]?.factory_id))

  }

  const data = {
    labels: ['CNC', 'FEBRICATION', 'COLORING', 'FEBRICATION', 'FEBRICATION', 'CNC'],
    datasets: [
      {
        label: 'Count',
        data: [12, 19, 3, 5, 14, 67],
        // backgroundColor: '#a78bfa',
        backgroundColor: 'rgba(255, 0, 0, 0.6)',


        // backgroundColor: 'transparent',
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // This hides the label
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawOnChartArea: false, // removes background grid lines
        },
        ticks: {
          stepSize: 10, // Y-axis steps of 10
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
          font: {
            size: 5, // x-axis label font size
          },
        },
      },

    },
  };




  return (
    <Link
      to={type === 'activejob' ? `/production/job/details/${item.id}` : "#"}
      className={`targetcardlink `}
      key={item.targetId}
      onClick={(e) => {
        if (type !== 'activejob') {
          e.preventDefault(); // stop navigation
        }
      }}
    >

      <div className="card-wrapper">
        <div className="card-container">
          <div className="corner top-left" />
          <div className="corner top-right" >

            <div
              className="completedDiv"
              style={{
                backgroundColor:
                  item?.status === 'rejected'
                    ? '#808080' // gray for rejected
                    : (item?.progressData?.lineup === 0 && item?.progressData?.processing === 0)
                      ? '#12c52d' // green - Done
                      : (item?.progressData?.processing === 0 && item?.progressData?.ready === 0)
                        ? '#ff6347' // red - Pending
                        : '#ffc107', // yellow - Processing
              }}
            >
              {item?.status === 'rejected' ? (
                <span><AiOutlineClockCircle /> Rejected</span>
              ) : (item?.progressData?.lineup === 0 && item?.progressData?.processing === 0) ? (
                <span><MdDone /> Done</span>
              ) : (item?.progressData?.processing === 0 && item?.progressData?.ready === 0) ? (
                <span><AiOutlineClockCircle /> Pending</span>
              ) : (
                <span><AiOutlineClockCircle /> Processing</span>
              )}
              <br />
              <span>{item.doneDate || '12-05-2025'}</span>
            </div>



          </div>
          <div className="corner bottom-left" />
          <div className="corner bottom-right" />
          <div className="card-content">
            <div className="date-label">
              {item.startDate}
            </div>
            <h2 className="card-title">Target Id : {item.targetId}</h2>
            <h3 className="card-subtitle">Unit Name : {item.unitName}</h3>
            <h3 className="card-subtitle">Target : {item.targetBatch} Batch</h3>
            <div className="card-description">
              {(() => {
                const progress = item.progressData || {}; // fallback in case undefined
                const total =
                  (progress.lineup || 0) +
                  (progress.processing || 0) +
                  (progress.ready || 0);


                return item.progressSections?.map((section, index) => {
                  const rawValue = progress[section.key] || 0;
                  const percentage = total === 0 ? 0 : (rawValue / total) * 100;

                  return (
                    <div key={index} className="CircularProgressSection">
                      <div className="CircularProgress">
                        <CircularProgressbar
                          styles={{
                            path: {
                              stroke: section.color,
                              strokeWidth: 15,
                            },
                          }}
                          value={percentage}
                          text={`${rawValue}`} // Show count instead of %
                        />
                      </div>
                      <Title level={5}>{section.label}</Title>
                    </div>
                  );
                });
              })()}

            </div>

            {type === 'activejob' ? <div className="card-tags">
              <BarChart options={options} data={item.barChartData} />
            </div> : ""}

            <div className="card-buttons">
              {/* Future buttons can be added here */}
              {type === 'activejob' ? "" : <>
                <Button onClick={() => hendelApprove(item.id)} type="primary" style={{ backgroundColor: 'green', borderColor: 'green' }}>Approve</Button>
                <Button onClick={() => hendelReject(item.id)} type="primary" style={{ width: '100px', backgroundColor: 'tomato', borderColor: 'tomato' }}>Reject</Button></>

              }
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TargetCard;
