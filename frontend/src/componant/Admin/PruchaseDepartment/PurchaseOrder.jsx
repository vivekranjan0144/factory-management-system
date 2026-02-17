import React, { useEffect } from 'react'
import Sidebar from '../../Sidebar/Sidebar'
import DashboardNavBar from '../DashboardNavBar/DashboardNavBar'
import { PurchaseNav } from '../../Navdata/dashboardNavData'
import "./formikform.css"
import { Formik, Form } from 'formik';
import { Input, Button, Select, Card } from 'antd';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFactory, fetchAllMaterials, fetchAllMaterialsforPurchese, fetchAllvendor } from '../../../features/auth/materialSlice'
import { createMaterialOrder, resetOrderState } from '../../../features/orderMaterialSlice'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

const { Option } = Select;

const PurchaseForm = ({ onSubmit }) => {

  const material = useSelector((state) => state.material);
  const orders = useSelector((state) => state.orders);
  //   const { error, success, message } = orders
  const { success, message } = orders.order || {};

  const dispatch = useDispatch()


  const materials = material.material?.map((m, index) => ({
    id: m.id || index + 100, // Ensure a unique ID fallback
    name: m.name,
  })) || [];
  const vendors = material.Vendor?.map((m, index) => ({
    id: m.id || index + 100, // Ensure a unique ID fallback
    name: m.name,
  })) || [];
  const factories = material.factory?.map((f) => ({
    id: f.factory_location_id,
    name: `${f.area_name}`,
  })) || [];


  // Validation Schema
  const validationSchema = Yup.object({
    material: Yup.string().required('Material is required'),
    vendor: Yup.string().required('Vendor is required'),
    factory: Yup.string().required('Factory is required'),
    full_amount: Yup.number().required('Full amount is required').min(1),
    advance_payment: Yup.number().required('Advance payment is required').min(0),
    quantity: Yup.number().required('Quantity is required').min(1),
  });



  useEffect(() => {
    if (success) {
      toast.success(message || "Order done successfully!");

      dispatch(resetOrderState());
    }
  }, [dispatch, success])




  return (
    <Card
      title="Add Purchase Info"
      className="max-w-xl mx-auto my-8"
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}
    >
      <Formik
        initialValues={{
          material: '',
          vendor: '',
          factory: '',
          full_amount: '',
          advance_payment: '',
          quantity: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
          <Form className='formikform'>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 16,
                rowGap: 12,
                marginBottom: 16,
              }}
            >
              {/* Row 1 - Material, Vendor */}
              <div style={{ flex: '1 1 700px' }}>
                <label>Material</label>
                <Select
                  placeholder="Select material"
                  size="small"
                  onChange={(value) => setFieldValue('material', value)}
                  onBlur={handleBlur}
                  value={values.material}
                  style={{ width: '100%' }}
                  className='formikinput'

                >
                  {materials.map((mat) => (
                    <Option key={mat.id} value={mat.name}>
                      {mat.name}
                    </Option>
                  ))}
                </Select>
                {touched.material && errors.material && (
                  <div style={{ color: 'red', fontSize: 12 }}>{errors.material}</div>
                )}
              </div>

              <div style={{ flex: '1 1 500px' }}>
                <label>Vendor</label>
                <Select
                  placeholder="Select vendor"
                  size="small"
                  onChange={(value) => setFieldValue('vendor', value)}
                  onBlur={handleBlur}
                  value={values.vendor}
                  style={{ width: '100%' }}
                  className='formikinput'

                >
                  {vendors.map((vendor) => (
                    <Option key={vendor.id} value={vendor.name}>
                      {vendor.name}
                    </Option>
                  ))}
                </Select>
                {touched.vendor && errors.vendor && (
                  <div style={{ color: 'red', fontSize: 12 }}>{errors.vendor}</div>
                )}
              </div>

              {/* Row 2 - Factory, Quantity */}
              <div style={{ flex: '1 1 500px' }}>
                <label>Factory</label>
                <Select
                  placeholder="Select factory"
                  size="small"
                  onChange={(value) => setFieldValue('factory', value)} // this should be the ID
                  value={values.factory}
                  style={{ width: '100%' }}
                  className='formikinput'
                >
                  {factories.map((fac) => (
                    <Option key={fac.id} value={fac.id}>
                      {fac.name}
                    </Option>
                  ))}
                </Select>
                {touched.factory && errors.factory && (
                  <div style={{ color: 'red', fontSize: 12 }}>{errors.factory}</div>
                )}
              </div>

              <div style={{ flex: '1 1 200px' }}>
                <label>Quantity</label>
                <Input
                  size="small"
                  type="number"
                  name="quantity"
                  placeholder="e.g. 20"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  className='formikinput'
                />
                {touched.quantity && errors.quantity && (
                  <div style={{ color: 'red', fontSize: 12 }}>{errors.quantity}</div>
                )}
              </div>

              {/* Row 3 - Full Amount, Advance Payment */}
              <div style={{ flex: '1 1 200px' }}>
                <label>Full Amount</label>
                <Input
                  size="small"
                  type="number"
                  name="full_amount"
                  placeholder="e.g. 100000"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.full_amount}
                  className='formikinput'


                />
                {touched.full_amount && errors.full_amount && (
                  <div style={{ color: 'red', fontSize: 12 }}>{errors.full_amount}</div>
                )}
              </div>

              <div style={{ flex: '1 1 200px' }}>
                <label>Advance Payment</label>
                <Input
                  size="small"
                  type="number"
                  name="advance_payment"
                  placeholder="e.g. 20000"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.advance_payment}
                  className='formikinput'

                />
                {touched.advance_payment && errors.advance_payment && (
                  <div style={{ color: 'red', fontSize: 12 }}>{errors.advance_payment}</div>
                )}
              </div>
            </div>

            <Button type="primary" htmlType="submit" loading={isSubmitting} block>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

// export default PurchaseForm;


// export default ProductMaterialForm;

// export default ProductMaterialForm;






const PurchaseOrder = () => {
  const dispatch = useDispatch()

  const {id}=useParams()
      const auth = useSelector((state) => state.auth);
  const handleSubmit = (values) => {
    console.log('Form values:', values);
    // Send to backend here
    dispatch(createMaterialOrder(values))
  };


  useEffect(() => {
    dispatch(fetchAllMaterialsforPurchese())
    dispatch(fetchAllvendor())
    dispatch(fetchAllFactory())
  }, [dispatch])
  return (
    <div className='layoutContainer'>
    
                  <Sidebar id={id} role={auth?.user?.role} />
      


      <div className="dashboardContainerLayout">

        <DashboardNavBar navOptions={PurchaseNav} />
        <div className="purchesemain">


          <PurchaseForm onSubmit={handleSubmit} />

        </div>
      </div>
    </div>
  )
}

export default PurchaseOrder