import React, { useEffect } from 'react'
import Sidebar from '../../Sidebar/Sidebar'
import DashboardNavBar from '../DashboardNavBar/DashboardNavBar'
import { PurchaseNav } from '../../Navdata/dashboardNavData'
import "./PurchaseDeptDashboard.css"
import AnalysisSection from './AnalysisSection'
import { FaShippingFast } from 'react-icons/fa'
import { MdBusiness } from 'react-icons/md'
import StepProgress from '../charts/StepProgress'
import { Button, DatePicker, Input } from 'antd'
import { AiOutlineOrderedList, AiOutlineSearch } from 'react-icons/ai'
import dayjs from 'dayjs';
import ItemTable from '../../Table/Table'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllorder, fetchAllorderPurchase } from '../../../features/orderMaterialSlice'
import { useParams } from 'react-router-dom'

const PurchaseDeptDashboard = () => {
    const { id } = useParams()
    const auth = useSelector((state) => state.auth);
    const orders = useSelector((state) => state.orders);

    const dispatch = useDispatch()
    useEffect(() => {

        dispatch(fetchAllorderPurchase())

    }, [dispatch])

    const data = orders.purchaseorder
        ? orders.purchaseorder.map((mat, index) => ({
            key: mat.order_id || String(index + 1),
            order_id: mat.order_id,
            material: mat.material,
            vendor: mat.vendor,
            factory: mat.factory?.area_name || 'N/A',
            amount: mat.full_amount,
            advance_payment: mat.advance_payment,
            quantity: mat.quantity,
            date: mat.date,
            rejectQtn: mat.rejectQuantity,
            statuses: mat.statuses?.map(status => ({
                status: status.status,
                time: status.createdAt,
            })) || [],
            logistics: mat.logistics || {},
            vendorInfo: mat.vendorInfo || {},
            paymentInfo: mat.paymentInfo || {
                totalAdvance: mat.advance_payment,
                remainingBalance: mat.full_amount - mat.advance_payment,
                totalAmount: mat.full_amount,
                paymentDate: mat.date,
            },
        }))
        : [];

    const columns = [
        {
            title: 'Order Id',
            dataIndex: 'key',
            key: 'key',

        },
        {
            title: 'Item',
            dataIndex: 'material',
            key: 'material',
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
            onFilter: (value, record) => record.material.toLowerCase().includes(value.toLowerCase()),

        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',

        },
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
                return dayjs(record.date).isSame(dayjs(value), 'day');
            },
        },
        {
            title: 'Status',
            dataIndex: 'statuses',
            key: 'status',

            // filters: [...new Set(data.map(item => item.statuses.at(-1)?.status))].map(step => ({
            //     text: String(step),
            //     value: step
            // })),
            filters: [...new Set(data.map(item => item.statuses.at(-1)?.status))]
                .filter(Boolean)
                .map(step => ({ text: String(step), value: step })),


            onFilter: (value, record) => record.statuses.at(-1)?.status === value,

            render: (statuses) => {
                const rawStatus = statuses.at(-1)?.status?.trim().toLowerCase();
                let color = '#d9d9d9'; // default

                switch (rawStatus) {
                    case 'store':
                        color = '#52c41a';
                        break;
                    case 'quantity check':
                        color = '#faad14';
                        break;
                    case 'order':
                        color = '#1890ff';
                        break;
                    case 'delivered':
                        color = '#13c2c2';
                        break;
                    case 'quality check':
                        color = '#faad14';
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
                            fontWeight: 500
                        }}
                    >
                        {statuses?.at(-1)?.status || 'N/A'}
                    </span>
                );
            }
        },
        // {
        //     title: 'Category',
        //     dataIndex: 'category',
        //     key: 'category',

        //     filters: [...new Set(data.map(item => item.category))].map(id => ({ text: String(id), value: id })),
        //     onFilter: (value, record) => record.category === value,

        // },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'key',
            filters: [...new Set(data.map(item => item.vendor))].map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.vendor === value,
            render: (vendor) => vendor || '-',
        },
        {
            title: 'Factory',
            dataIndex: 'factory',
            key: 'factory',
            // filters: [...new Set(data.map(item => item.factory))].map(name => ({ text: name, value: name })),
            filters: [...new Set(data.map(item => item.vendor))].filter(Boolean).map(name => ({ text: name, value: name })),

            onFilter: (value, record) => record.factory === value,
            render: (factory) => factory || '-',
        },
        {
            title: 'Reject Qtn',
            dataIndex: 'rejectQtn',
            key: 'rejectQtn',
            filters: [...new Set(data.map(item => item.rejectQtn))].map(id => ({ text: String(id), value: id })),
            onFilter: (value, record) => record.rejectQtn === value,
            render: (value) => (
                <span
                    style={{
                        backgroundColor: value > 0 ? '#ff4d4f' : 'transparent',
                        color: value > 0 ? '#fff' : '#000',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontWeight: value > 0 ? 600 : 400,
                    }}
                >
                    {value}
                </span>
            )
        }
    ];



    const ExpandedRowContent = ({ record }) => {
        const { vendor, logistics, order_id, paymentInfo } = record;
        const allSteps = ['order', 'delivered', 'quality check', 'quantity check', 'store'];

        return (
            <div className="custom-expanded-row" key={record.key}>
                <h1 style={{ margin: 0, color: 'green' }}>{order_id}</h1>

                {/* Step progress component */}
                <StepProgress allSteps={allSteps} record={record} />

                {/* Order info */}
                <div className="deliveryDetails" style={{ marginTop: '30px' }}>
                    <h4>Order Info</h4>
                    <div className="orderInfoBoxContain">
                        <div className="orderinfoBox">
                            <div>
                                <h4> <MdBusiness /> Vendor Info</h4>
                                <span><strong>Name:</strong> {vendor?.name}</span><br />
                                <span><strong>Contact:</strong> {vendor?.contact}</span><br />
                                <span><strong>Email:</strong> {vendor?.email}</span><br />
                                <span><strong>Location:</strong> {vendor?.location}</span>
                            </div>
                            <div>
                                <h4> <FaShippingFast /> Logistic Information</h4>
                                <span><strong>Transporter:</strong> {logistics?.transporter}</span><br />
                                <span><strong>Tracking ID:</strong> {logistics?.trackingId}</span><br />
                                <span><strong>Expected Delivery:</strong> {logistics?.expectedDelivery}</span><br />
                                <span><strong>Mode:</strong> {logistics?.mode}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="paymentDetails">


                    <h3>Payment Info</h3>
                    <div className="paymentBox">
                        <div className="paymentItem">
                            <div className="label">Advance Payment :</div>
                            <div className="value">{paymentInfo?.totalAdvance}</div>
                        </div>
                        <div className="paymentItem">
                            <div className="label">Remaining Payment :</div>
                            <div className="value">{paymentInfo?.remainingBalance}</div>
                        </div>
                        <div className="paymentItem">
                            <div className="label">Total Amount :</div>
                            <div className="value">{paymentInfo?.totalAmount}</div>
                        </div>
                        <div className="paymentItem">
                            <div className="label">Payment Date :</div>
                            <div className="value">{paymentInfo?.paymentDate}</div>
                        </div>
                    </div>

                </div>


            </div>
        );
    };


    return (
        <div className='layoutContainer'>
            <Sidebar id={id} role={auth?.user?.role} />


            <div className="dashboardContainerLayout">

                <DashboardNavBar navOptions={PurchaseNav} />
                <div className="purchesemain">

                    <AnalysisSection />
                    <div className='purchesTable'>

                        <h3 className='h3Header'> <AiOutlineOrderedList />Raw Material Order List</h3>


                        <ItemTable renderExpandedRow={(record) => <ExpandedRowContent record={record} />} columns={columns} data={data} />
                    </div>
                </div>


            </div>
        </div>
    )
}

export default PurchaseDeptDashboard