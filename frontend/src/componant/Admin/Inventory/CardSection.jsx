import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutGroup } from 'framer-motion';
import { AiOutlineTool } from 'react-icons/ai';
import Card1 from '../charts/Card1'; // adjust this import as needed
import { fetchAllMaterials } from '../../../features/auth/materialSlice';
import { fetchAllFactory } from '../../../features/factorySlice';
import './cardSection.css'
const CardSection = () => {
  const dispatch = useDispatch();

  const factories = useSelector((state) => state.factory) || [];

  useEffect(() => {
    dispatch(fetchAllFactory());
  }, [dispatch]);

  return (
    <div className="Cards">
      <LayoutGroup>
        {factories.factory?.map((factory, index) => (
          <div key={factory.factory_location_id || index} className="parentContainer">
            <Card1
              id={factory.factory_location_id}
              title={factory.area_name || `Factory ${index + 1}`}
              color={{
                backGround: "linear-gradient(180deg, #1de9b6 0%, #00e5ff 100%)",
                boxShadow: "0px 12px 22px 0px rgba(29, 233, 182, 0.6)",
              }}
              barValue1={Math.floor(Math.random() * 100)}
              barValue2={Math.floor(Math.random() * 100)}
              barValue3={Math.floor(Math.random() * 100)}
              value={(Math.random() * 100).toFixed(0)}
              png={AiOutlineTool}
              series={[
                {
                  name: "Production",
                  data: [
                    Math.floor(Math.random() * 100),
                    Math.floor(Math.random() * 100),
                    Math.floor(Math.random() * 100),
                    Math.floor(Math.random() * 100),
                  ],
                },
              ]}
            />
          </div>
        ))}
      </LayoutGroup>
    </div>
  );
};

export default CardSection;
