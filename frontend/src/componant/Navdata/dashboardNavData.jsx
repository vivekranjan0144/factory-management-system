import { AiOutlineClockCircle, AiOutlineDashboard, AiOutlineDatabase, AiOutlineDeliveredProcedure, AiOutlineMail, AiOutlinePieChart } from 'react-icons/ai'
import {  useSelector } from 'react-redux';


export const getNavOptions = (id) => [
    


    {
        nav: 'Store',
        link: `/details/${id}`,
        icon: <AiOutlineDashboard />
    },
    {
        nav: 'Purches Order',
        link: `/details/purches/${id}`,
        icon: <AiOutlinePieChart />
    },
    {
        nav: 'Active Production',
        link: `/production/job/${id}`,
        icon: <AiOutlinePieChart />
    },
    {

        nav: 'Target Board',
        link: `/production/target/${id}`,
        icon: <AiOutlineDashboard />
    },
   
    {
        nav: 'Material Request',
        link: `/Inventory/request/${id}`,
        icon: <AiOutlineMail />
    },
    // {
    //     nav: 'Jobs',
    //     link: `/ganaral-manager/Jobs`,
    //     icon: <AiOutlineMail />
    // },
    // {
    //     nav: 'Staff',
    //     link: `/ganaral-manager/Jobs`,
    //     icon: <AiOutlineMail />
    // },
    // {
    //     nav: 'Vendors',
    //     link: `/ganaral-manager/vendors`,
    //     icon: <AiOutlineMail />
    // },


    {
        nav: 'Ready',
        link: `/finish_goods/${id}`,
        icon: <AiOutlineDeliveredProcedure />
    }
];


export const getProductionNavOptions = (id) => [

    {
        nav: 'Active Production',
        link: `/production/job/${id}`,
        icon: <AiOutlinePieChart />
    },
    {

        nav: 'Target Board',
        link: `/production/target/${id}`,
        icon: <AiOutlineDashboard />
    },

    {
        nav: 'Inventory',
        link: '/details/inventory',

        icon: <AiOutlineDatabase />
    },
    {
        nav: 'Request',
        link: '/Inventory/request',
        icon: <AiOutlineMail />
    },
    {
        nav: 'Update Stock',
        icon: <AiOutlineClockCircle />
    },
    {
        nav: 'Ready',
        icon: <AiOutlineDeliveredProcedure />
    },


]

export const StockAnalasysOptions = [
    {
        nav: 'Product',
        // link: '/details',
        icon: <AiOutlineDashboard />
    },
    {
        nav: 'Department',
        // link: '/details/inventory',

        icon: <AiOutlineDatabase />
    },
    {
        nav: 'Production',
        // link: '/details/analysis',
        icon: <AiOutlinePieChart />
    },

]

export const PurchaseNav = [
    {
        nav: 'Dashboard',
        link: '/Purchase',
        icon: <AiOutlineDashboard />
    },
    {
        nav: 'Create Order',
        link: '/Purchase/order',

        icon: <AiOutlineDatabase />
    },
    // {
    //     nav: 'Order History',
    //     // link: '/details/analysis',
    //     icon: <AiOutlinePieChart />
    // },
    // {
    //     nav: 'Create Target',
    //     link: '/Create/Target',
    //     icon: <AiOutlinePieChart />
    // },

]