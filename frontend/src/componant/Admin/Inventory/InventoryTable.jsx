import React, { useEffect } from 'react'
import ItemTable from '../../Table/Table'

import { Button, Input } from 'antd'
import { AiOutlineDatabase, AiOutlineSearch } from 'react-icons/ai'
import {useDispatch, useSelector} from 'react-redux'
import { fetchAllMaterials } from '../../../features/auth/materialSlice'
import { useParams } from 'react-router-dom'

const InventoryTable = () => {

  const material = useSelector((state) => state.material);
 const { id } = useParams(); 
 const dispatch=useDispatch()
 useEffect(() => {
   dispatch(fetchAllMaterials(id))
   
 }, [dispatch,id])
 

// console.log(material)

 const data = material.materials
  ? material.materials.map((mat) => ({
      key: mat.material_id,
      material_id: mat.material_id,
      name: mat.name,
      category: mat.category?.category_name || 'N/A',
      variant: mat.variant?.variant_name || 'N/A',
      location: mat.location?.location_name || 'N/A',
      uom: mat.uom,
      reorder_level: mat.reorder_level,
      storage_temperature: mat.storage_temperature,
      stock: mat.current_stock,
    }))
  : [];




  const columns = [
    {
      title: 'Item Code',
      dataIndex: 'material_id',
      key: 'key',

    },
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
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
  title: 'Stock',
  dataIndex: 'stock',
  key: 'stock',
  filterMultiple: false,
  filters: [
    { text: 'Low to High', value: 'asc' },
    { text: 'High to Low', value: 'desc' }
  ],
  onFilter: () => true,
  render: (_, record) => {
    const { stock, reorder_level } = record;
    let color = '#8c8c8c'; // Default: grey for zero or undefined

    if (reorder_level && reorder_level > 0) {
      const percentage = (stock / reorder_level) * 100;
      if (percentage > 60) color = '#52c41a';         // Green
      else if (percentage > 40) color = '#faad14';     // Yellow
      else color = '#f5222d';                          // Red
    }

    return (
      <span
        style={{
          backgroundColor: color,
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '6px',
          fontWeight: 500,
          minWidth: '40px',
          display: 'inline-block',
          textAlign: 'center',
        }}
      >
        {stock}
      </span>
    );
  
},

    },
      {
      title: 'uom',
      dataIndex: 'uom',
      key: 'uom',
    },
    {
      title: 'variant',
      dataIndex: 'variant',
      key: 'variant',
    },
    // {
    //   title: 'Specification',
    //   dataIndex: 'specification',
    //   key: 'specification',

    //   filters: [...new Set(data.map(item => item.specification))].map(id => ({ text: String(id), value: id })),
    //   onFilter: (value, record) => record.specification === value,
    // },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',

      filters: [...new Set(data.map(item => item.category))].map(id => ({ text: String(id), value: id })),
      onFilter: (value, record) => record.category === value,

    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',

      filters: [...new Set(data.map(item => item.location))].map(id => ({ text: String(id), value: id })),
      onFilter: (value, record) => record.location === value,
    },
    // {
    //   title: 'reorder_level',
    //   dataIndex: 'reorder_level',
    //   key: 'reorder_level',
    //   filters: [...new Set(data.map(item => item.department))].map(id => ({ text: String(id), value: id })),
    //   onFilter: (value, record) => record.department === value,
    // },
    // {
    //   title: 'Department',
    //   dataIndex: 'department',
    //   key: 'department',
    //   filters: [...new Set(data.map(item => item.department))].map(id => ({ text: String(id), value: id })),
    //   onFilter: (value, record) => record.department === value,
    // },
  
    {
      title: 'storage_temperature',
      dataIndex: 'storage_temperature',
      key: 'storage_temperature',
    },
    {
      title: 'Graph',
      dataIndex: 'graph',
      key: 'graph',
    },
  ];


  return (
    <div className="storeDetailsTable">
      <h3 className='h3Header'> <AiOutlineDatabase />Inventorys</h3>
      <ItemTable columns={columns} data={data} renderExpandedRow={(record) => (
        <div className="custom-expanded-row">
          <h1 style={{ margin: 0, color: 'green' }}>{record.name}</h1>
        
        </div>
      )} />
    </div>
  )
}

export default InventoryTable