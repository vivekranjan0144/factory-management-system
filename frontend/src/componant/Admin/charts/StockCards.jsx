import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Flex, Progress, Typography } from 'antd';
import { MdOutlineArrowCircleUp } from 'react-icons/md';
import { AiOutlineBarChart } from 'react-icons/ai';

import './storAnalatic.css';

import PieChart from './PieChart';
import { fetchAllMaterials } from '../../../features/auth/materialSlice';

const { Text } = Typography;

const StorAnalaticCard = ({ stockData }) => {
  const steps = 30;

  // Pie chart data for Yellow, Low and Ready stocks + Normal Stock
  const paistock = stockData
    .filter(item => ['Yellow Stock (40% - 60%)', 'Low Stock (< 40%)', 'Ready Product'].includes(item.heading))
    .map(item => ({
      heading: item.heading,
      percent: item.percent,
      strokeColor: item.strokeColor,
    }));

  const usedPercent = paistock.reduce((sum, item) => sum + item.percent, 0);
  const remainingPercent = Math.max(0, 100 - usedPercent);
  if (remainingPercent > 0) {
    paistock.push({
      heading: "Normal Stock",
      percent: remainingPercent,
      strokeColor: '#52c41a',
    });
  }

  const pieChartData = {
    labels: paistock.map(item => item.heading),
    datasets: [
      {
        label: 'Stock Distribution',
        data: paistock.map(item => item.percent),
        backgroundColor: paistock.map(item => item.strokeColor),
      }
    ]
  };

  return (
    <div className="cardAndpie">
      <div className="analaticCards">
        {stockData.map((item, id) => (
          <div key={id} className="analaticard">
            <div className="analaticCardleft">
              <div className="analaticHeader">
                <Text level={3} style={{ padding: '5px', color: 'black' }}>{item.heading}</Text>
              </div>
              <div className="dotedChart" style={{ display: 'flex' }}>
                <Flex gap="small" vertical>
                  <Progress
                    percent={item.percent}
                    steps={steps}
                    strokeWidth={12}
                    strokeColor={item.strokeColor}
                    type="dashboard"
                    showInfo
                   trailColor="#e0e0e0" 
                    gapDegree={180}
                    gapPosition="bottom"
                    style={{ transform: 'rotate(360deg)' }}
                  />
                </Flex>
              </div>
            </div>
            <div className="analaticCardRight">
              <Text level={5}>Total Items</Text>
              <span>{item.count} <span id="percenbox"><MdOutlineArrowCircleUp /> {item.percent}%</span></span>
            </div>
          </div>
        ))}
      </div>
      <div className="piechart">
        <PieChart data={pieChartData} />
      </div>
    </div>
  );
};

const StockCards = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const material = useSelector(state => state.material);

  useEffect(() => {
    if (id) {
      dispatch(fetchAllMaterials(id));
    }
  }, [dispatch, id]);

  const materials = material.materials || [];

  const safeDivide = (part, total) => (total ? Math.round((part / total) * 100) : 0);

  let greenCount = 0;
  let yellowCount = 0;
  let redCount = 0;
  let readyProductCount = 0;

  materials.forEach(m => {
    if (!m.reorder_level) return;

    const stockPercent = (m.current_stock / m.reorder_level) * 100;

    if (stockPercent >= 60) greenCount++;
    else if (stockPercent >= 40) yellowCount++;
    else redCount++;

    if (m.category?.category_name === 'Ready Product') readyProductCount++;
  });

  const totalMaterials = materials.length;

  const stockData = [
    {
      heading: "Sufficient Stock (≥ 60%)",
      percent: safeDivide(greenCount, totalMaterials),
      count: greenCount,
      strokeColor: 'green',
    },
    {
      heading: "Yellow Stock (≥40%)",
      percent: safeDivide(yellowCount, totalMaterials),
      count: yellowCount,
      strokeColor: '#faad14',
    },
    {
      heading: "Low Stock (< 40%)",
      percent: safeDivide(redCount, totalMaterials),
      count: redCount,
      strokeColor: '#ff4d4f',
    },
    {
      heading: "Ready Product",
      percent: safeDivide(readyProductCount, totalMaterials),
      count: readyProductCount,
      strokeColor: '#52c41a',
    }
  ];

  return (
    <div className="analaticComponant">
      <div className="analaticComponantHeader">
        <h3 className="h3Header"><AiOutlineBarChart /> Store Analatic</h3>
      </div>
      <StorAnalaticCard stockData={stockData} />
    </div>
  );
};

export default StockCards;
