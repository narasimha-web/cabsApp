import React,{useState,useEffect} from 'react';
import { CTable,CTableHead,CTableRow,CTableHeaderCell,CRow,CCol,CButton, CContainer,
    CModal,CModalBody,CModalHeader,CModalTitle,CInputGroup,CInputGroupText,CFormInput,
    CFormSelect,CForm,
    CTableBody,
    CTableDataCell
 } from '@coreui/react';
 import CIcon from '@coreui/icons-react'
import { cilCarAlt } from '@coreui/icons'

const Trips = () => {
    const [visible,setVisible] = useState(false);
    const [customerData,setCustomerData] = useState([]);
    const [driverData,setDriverData] = useState([])
    const [validated,setValidated] = useState(false);
    const [tripsData,setTripsData] = useState([])
    const [userData,setUserData] = useState({
      customerId:"",driverId:"", paymentType:"",status:"",source:"",destination:"",
    });
    //------------------fetchCustomers----------------------------------
    const fetchCustomers = async()=>{
        try{
            const responce = await fetch("http://localhost:8000/api/fetchCustomers",{
                method : 'GET',
                headers :{
                  "Content-Type": "application/json"
                }
            })
            const data = await responce.json()
            setCustomerData(data.responce)
        }catch(err){
            console.log(err)
        }
    };
    //--------------------------------------fetch Drivers----------------------------
    const fetchDreivers = async () => {
        try{
            const responce = await fetch("http://localhost:8000/api/drivers",{
                method : "GET",
                headers:{
                    "Content-Type" :"application/json"
                }
            })
            const data = await responce.json()
            setDriverData(data.fetchData)
        }catch(err){
            console.log(err)
        }
    };
    //------------------fetchTrips------------------------------------------------
    const fetchTrips = async () => {
        try{
            const response = await fetch("http://localhost:8000/api/trips",{
                method:"GET",
                headers:{
                    "Content-Type" : "application/json"
                }
            });
            const data = await response.json();
            setTripsData(data.response)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        fetchCustomers();
        fetchDreivers();
        fetchTrips();
    },[])
  
 

    const handleChange = (e)=> {
        const { name,value }= e.target;
        setUserData({
            ...userData,
            [name]: value
        })
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }   
        console.log(userData)
// to sending the data into database
        try{
            const responce = await fetch("http://localhost:8000/api/savedTrips",{
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(userData)
            });
            const data = await responce.json()
            setVisible(false)
            fetchTrips();
        }catch(err){
            console.log(err)
        }
    }
    return(
    
        <>
            <CRow>
                <CCol></CCol>
                <CCol>  <CButton color="primary"  style={{ float: 'right',marginRight:"30px",width:"160px",marginBottom:"10px" }} onClick={()=>setVisible(!visible)}><CIcon icon={cilCarAlt}/> New Trip</CButton></CCol>
            </CRow>
            <CContainer>
                <CTable bordered hover striped>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>S.No</CTableHeaderCell>
                            <CTableHeaderCell>Customer Name</CTableHeaderCell>
                            <CTableHeaderCell>Driver Name</CTableHeaderCell>
                            <CTableHeaderCell>Payment Type</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Source</CTableHeaderCell>
                            <CTableHeaderCell>Destination</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                            {tripsData.map((trips,index)=>(
                                     <CTableRow key={index}>
                                     <CTableDataCell scope='row'>{index + 1}</CTableDataCell>
                                     <CTableDataCell>{trips.customerDetails[0].name}</CTableDataCell>
                                     <CTableDataCell>{trips.driverDetails[0].name}</CTableDataCell>
                                     <CTableDataCell>{trips.paymentId}</CTableDataCell>
                                     <CTableDataCell>{trips.status}</CTableDataCell>
                                     <CTableDataCell>{trips.source}</CTableDataCell>
                                     <CTableDataCell>{trips.destination}</CTableDataCell>

                                 </CTableRow>
                            ))}
                    </CTableBody>
                    <CTableBody>

                    </CTableBody>
                </CTable>
            </CContainer>

{/* ---------------------------models----------------------------------------------------- */}

        
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="VerticallyCenteredExample"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">Add Trips</CModalTitle>
      </CModalHeader>
      <CModalBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <CInputGroup className="mb-3">
                    <CFormSelect size="lg" className="mb-3" aria-label="Large select example" name='customerId' onChange={handleChange}>
                    <option>Customer Name</option>
                    {customerData.map((user)=>(
                    <option key={user.name} value={user._id}>{user.name}</option>
                    ))}
                    </CFormSelect>
                    </CInputGroup>
           <CInputGroup className="mb-4">
                   <CFormSelect size="lg" className="mb-3" aria-label="Large select example" name='driverId' onChange={handleChange}>
                    <option>Driver Name</option>
                    {driverData.map((driver)=>(
                    <option key={driver.name} value={driver._id}>{driver.name}</option>
                    ))}
                    </CFormSelect>
                    </CInputGroup>
            <CInputGroup className="mb-4">
                   <CFormSelect size="lg" className="mb-3" aria-label="Large select example" name='paymentType' value={userData.paymentType} onChange={handleChange}>
                    <option>Payment Type</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    </CFormSelect>
                    </CInputGroup>
           <CInputGroup className="mb-4">
                    <CFormSelect size="lg" className="mb-3" aria-label="Large select example" name='status'value={userData.status} onChange={handleChange}>
                    <option>Status</option>
                    <option value="pending">pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    </CFormSelect>
                    </CInputGroup>
            <CInputGroup className="mb-4">              
                    <CFormInput
                    type="text"
                    placeholder="source"
                    autoComplete="source"
                    feedbackInvalid ="Field Required"
                    name='source'
                    value={userData.source}
                    onChange={handleChange}
                    required
                    />
                    </CInputGroup>
            <CInputGroup className="mb-4">              
                    <CFormInput
                    type="text"
                    placeholder="Destination From -To"
                    autoComplete="destination"
                    feedbackInvalid ="Field Required"
                    name='destination'
                    value={userData.destination}
                    onChange={handleChange}
                    required
                    />
                    </CInputGroup>
                    <CButton color="primary" type='submit' style={{float :"right"}}>Submit</CButton>
            </CForm>
      </CModalBody>
    </CModal>

        </>
    )
}

export default Trips