import React, { useEffect, useState } from 'react'
import DashboardNavBar from '../DashboardNavBar/DashboardNavBar'
import Sidebar from '../../Sidebar/Sidebar'
import StockAnalasysSection from '../charts/StockAnalasysSection'
import { getNavOptions } from '../../Navdata/dashboardNavData'
import ItemTable from '../../Table/Table'
import { Button, Input, Popconfirm } from 'antd'
import { AiOutlineCar, AiOutlineOrderedList, AiOutlineSearch, AiOutlineTruck } from 'react-icons/ai'
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { Steps } from 'antd';
import "./Stepbar.css"
import StepProgress from '../charts/StepProgress'
import { MdBusiness } from 'react-icons/md'
import { FaShippingFast } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllorder, resetOrderUpdate, UpdateOrder } from '../../../features/orderMaterialSlice'
import { toast } from 'react-toastify'
import { approveMaterialRequests, fetchMaterialRequests, resetApprovalState } from '../../../features/Inventory/MaterialRequestSlice'
import { formatDate } from '../../../utils/dateformate'
import { useParams } from 'react-router-dom'


const InventoryRequest = () => {

    const { id } = useParams()
const auth = useSelector((state) => state.auth);

    const navOptions = getNavOptions(id)
    // const { data, loading, error } = useSelector((state) => state.materialRequests);
    const { data, approving, approvalSuccess, approvalError } = useSelector((state) => state.materialRequests)


    const { success, message } = data

    const dispatch = useDispatch()
    // const [action, setAction] = useState('')
    const heandelStatusUpdate = (id) => {
        const action = 'finish';
        // console.log(id)
        dispatch(approveMaterialRequests({ id, action }));
        // dispatch(resetApprovalState())
    };

    // When `success` changes (update succeeds), show toast and refetch orders


    const RowData = data
        ? data.map((req, index) => ({
            key: req.key,
            material_request_id: req.id,
            batch_id: req.batch_id,
            material: req.material?.name || 'N/A',
            material_id: req.material?.material_id || req.material_id,
            department: req.department_name || 'Unknown', // ✅ Department name
            requested_by: req.employee_name || 'Unknown',
            requester_id: req.employee?.employee_id || req.requested_by,
            requests: req.requests,
            // date: new Date(req.requests[0]?.createdAt).toLocaleString(),
            date: formatDate(req.requests[0]?.createdAt),

            statuses: req.statuses?.map((status) => ({
                status: status.status,
                changed_by: status.changed_by,
                createdAt: new Date(status.createdAt).toLocaleString(),
            })) || [],
        }))
        : [];
    const STATUS_COLORS = {
        'CNC': '#FF6384',
        'FABRICATION AND GRINDING': 'tomato',
        'POWDER COATING AND TREATMENT PLANT': '#FFCD56',
        'ENGINE AND CANOPY ASSEMBLING': '#FF9F40',
        'ROCKWOOL AND FOAM FITTING': '#a78bfa',
        'ELECTRICAL AND PANEL': '#36A2EB',
        'TESTING': 'blue',
        'READY TO DISPATCH': '#4CAF50',
    };
    const columns = [
        {
            title: 'Order Id',
            dataIndex: 'key',
            key: 'key',

        },

        // {
        //     title: 'batch Id',
        //     dataIndex: 'batch_id',
        //     key: 'batch_id',

        // },
        // {
        //     title: 'Item',
        //     dataIndex: 'material',
        //     key: 'material',
        //     fixed: 'left',

        //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        //         <div style={{ padding: 8 }}>
        //             <Input
        //                 autoFocus
        //                 placeholder="Search Name"
        //                 value={selectedKeys[0]}
        //                 onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        //                 onPressEnter={() => confirm()}
        //                 style={{ marginBottom: 8, display: 'block' }}
        //             />
        //             <Button
        //                 type="primary"
        //                 onClick={() => confirm()}
        //                 icon={<AiOutlineSearch />}
        //                 size="small"
        //                 style={{ width: 90, marginRight: 8 }}
        //             >
        //                 Search
        //             </Button>
        //             <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
        //                 Reset
        //             </Button>
        //         </div>
        //     ),
        //     onFilter: (value, record) => record.item.toLowerCase().includes(value.toLowerCase()),

        // },

        {
            title: 'Order Date',
            dataIndex: 'date',
            key: 'date',
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
                    <Button
                        onClick={() => clearFilters()}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </div>
            ),
            onFilter: (value, record) => {
                // Assuming record.date is a string in 'YYYY-MM-DD' format
                return dayjs(record).isSame(dayjs(value), 'day');
            },
        },
        {
            title: 'Status',
            dataIndex: 'statuses',
            key: 'statuses',

            filters: [...new Set(RowData.map(item => item.statuses.at(-1)?.status))]
                .filter(Boolean)
                .map(status => ({
                    text: String(status),
                    value: status
                })),

            onFilter: (value, record) => record.statuses.at(-1)?.status === value,

            render: (statuses) => {
                const rawStatus = statuses.at(-1)?.status?.trim().toLowerCase() || 'pending';
                let color = '#d9d9d9'; // default grey

                switch (rawStatus) {
                    case 'approved':
                        color = '#52c41a'; // green
                        break;
                    case 'pending':
                        color = '#faad14'; // orange
                        break;
                    case 'rejected':
                        color = '#f5222d'; // red
                        break;
                    case 'issued':
                        color = '#1890ff'; // blue
                        break;
                    case 'delivered':
                        color = '#13c2c2'; // cyan
                        break;
                    case 'quality check':
                        color = '#722ed1'; // purple
                        break;
                    default:
                        break;
                }

                return (
                    <span
                        style={{
                            backgroundColor: color,
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: 500,
                        }}
                    >
                        {statuses.at(-1)?.status || 'PANDING'}
                    </span>
                );
            }
        },


        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            filters: [...new Set(data.map(item => item.department))]
                .filter(Boolean)
                .map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.department === value,
            render: (department) => {
                const color = STATUS_COLORS[department?.toUpperCase()] || '#d9d9d9';
                return (
                    <span
                        style={{
                            backgroundColor: color,
                            color: '#fff',

                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: 500,
                            textTransform: 'uppercase'
                        }}
                    >
                        {department?.toUpperCase() || '-'}
                    </span>
                );
            }
        },
        {
            title: 'Request By',
            dataIndex: 'requested_by',
            key: 'requested_by',
            filters: [...new Set(data.map(item => item.requested_by))].map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.requested_by === value,
            render: (requested_by) => requested_by || '-',
        },

        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record) => {
                const rawStatus = record.statuses.at(-1)?.status;

                let color = '#52c41a'; // default

                switch (rawStatus) {
                    case 'approved':
                        color = '#d9d9d9';

                        break;

                    default:
                        break;
                }
                return (
                    <Popconfirm
                        title="Are you sure you want to mark this step as complete?"
                        onConfirm={() => heandelStatusUpdate(record.batch_id)}
                        okText="Yes"
                        cancelText="No"
                    // disabled={rawStatus === 'store'} 
                    >
                        <Button
                            disabled={rawStatus === 'approved'}
                            loading={approving}
                            // onClick={() => heandelStatusUpdate(record.key)}
                            style={{
                                backgroundColor: 'white',
                                borderColor: color,
                                color: color,
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '10px',
                            }}
                            type="primary"
                        >
                            {rawStatus}   Complete
                        </Button></Popconfirm>
                );
            }


        },
    ];
    const ExpandedRowContent = ({ record }) => {

        return (
            <div className="custom-expanded-row" key={record.key}>
                {/* <h3 style={{ margin: 0, color: 'green' }}>Batch ID: {record.batch_id}</h3> */}

                {/* Material List */}
                <div style={{ marginTop: '20px' }}>
                    <h4>Requested Materials</h4>
                    <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f0f0f0' }}>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Material Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Material ID</th>
                                {/* <th style={{ border: '1px solid #ddd', padding: '8px' }}>Department</th> */}
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Department</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Requested By</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {record.requests?.map((req) => (
                                <tr key={req.id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{req.material?.name || '-'}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{req.material?.material_id || '-'}</td>
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>{req.material?.department?.name || '-'}</td> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{req.material?.department?.name.toUpperCase() || '-'}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{req.employee?.name || '-'}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{formatDate(req.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };


    useEffect(() => {
        if (approvalSuccess) {
            toast.success(approvalSuccess || "Approvel success");
            dispatch(resetApprovalState());
        }
        if (approvalError) {
            toast.error(approvalError.error || "Error while approved");
            dispatch(resetApprovalState());
        }
        dispatch(fetchMaterialRequests(id));
        // console.log(id)

    }, [approvalSuccess, approvalError, message, dispatch, id]);

    // Initial load of orders (optional if you want on mount)
    useEffect(() => {
        dispatch(fetchMaterialRequests(id));

    }, [dispatch]);
    return (
        <div className='layoutContainer'>
      <Sidebar id={id} role={auth?.user?.role} />


            <div className="dashboardContainerLayout">

                <DashboardNavBar navOptions={navOptions} />

                <StockAnalasysSection />
                <div className="storeDetailsTable">
                    <h3 className='h3Header'> <AiOutlineOrderedList /> Material Request List</h3>
                    <ItemTable renderExpandedRow={(record) => <ExpandedRowContent record={record} />} columns={columns} data={RowData} />
                </div>
            </div>

        </div>
    )
}

export default InventoryRequest