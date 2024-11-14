import React,{useState,useEffect} from 'react'
import { CTable,CTableHead,CTableRow,CTableHeaderCell,CTableBody,CTableDataCell, CContainer,
    CCol,CButton,CRow, CModalTitle,CModal,CModalHeader,CModalBody,CModalFooter,CForm,CInputGroup,
    CInputGroupText,CFormInput
 } from '@coreui/react';
 import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser,cilAddressBook } from '@coreui/icons';




const Drivers = () => {
    const [driverData,setDriverData] = useState([]);
    const [visible,setVisible] = useState(false);
    const [validated,setValidated] = useState(false);
    const [errorMessage,setErrorMessage] = useState("")
    const [driverId,setDriverId] = useState(null);
    const [visiblee,setVisiblee] = useState(false);
    const [deleteId,setDeleteId] = useState(null);
    const [ userData,setUserData] = useState({
        name:"",email:"",password:"",dob:"",
        location:
        {city:"",state:"",country:"",postalCode:""},
       
    });
  
    const fetchDrivers = async()=>{
      try{
          const responce = await fetch("http://localhost:8000/api/drivers",{
              method : "GET",
              headers :{
                  "Content-Type":"application/json"
              }
          });
          const data = await responce.json();
          setDriverData(data.fetchData)
    
      }catch(err){
          console.log(err)
      }
    }

useEffect(()=>{
  fetchDrivers();
},[]);

const handleChange = (e) => {
  const { name, value } = e.target;

  if (['city', 'state', 'country', 'postalCode'].includes(name)) {
    setUserData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        [name]: value, // Update the specific field in location
      },
    }));
  } else {
    // Update other fields outside of location
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};
//submiting the form
  const handleSubmit = async(e) =>{
    console.log(userData)
    e.preventDefault();
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true)
      return
    }
    const url = driverId ? `http://localhost:8000/api/updateDriver/${driverId}`:"http://localhost:8000/api/savedDrivers";
    const method = driverId ? "PUT" : "POST"
    try{
      const responce = await fetch(url,{
        method ,
        headers:{
           'Content-Type':"application/json"
        },
        body :JSON.stringify(userData)
      })
      const data = await responce.json();
      console.log(data)
      if(data.status === 1){
        setErrorMessage("User Already Register");
        return;
      }
      setVisible(false);
      setUserData({});
      setValidated(false);
      fetchDrivers();
    }catch(err){
      console.log(err)
    }
  } ;
  //------------Edit driver------------------------
  const handleEditDriver = (data) =>{
    setVisible(true);
    setDriverId(data._id);
    setUserData({
      name : data.name,
      // cabId :data.cabId,
      email:data.email,
      password:data.password,
      dob:data.dob,
      createdAt:data.createdAt,
      location :{
        city : data.location.city,
        state:data.location.state,
        country:data.location.country,
        postalCode:data.location.postalCode
      }
    })
    fetchDrivers();
  };
  //--------------------------Delete Driver----------------------------------------
  const handleDelete = async(id)=>{
    setVisiblee(true);
    setDeleteId(id)
  };

  const driverDelete = async () => {
    try{
      const responce = await fetch(`http://localhost:8000/api/driverDelete/${deleteId}`,{
        method : "DELETE",
        headers :{
          "Content-Type":"application/json"
        },
      })
      const data = responce.json();
      console.log(data);
      setVisiblee(false);
      fetchDrivers();
    }catch(err){
      console.log(err)
    }
  }
  return (
    <>
    
        <CRow>
            <CCol>
                
            </CCol>
            <CCol>
            <CButton color="primary"   style={{ float: 'right',marginRight:"30px",width:"160px",marginBottom:"10px" }} onClick={()=>setVisible(!visible)}>New</CButton>
            </CCol>
        </CRow>
    <CTable striped hover bordered>
  <CTableHead>
    <CTableRow>
      <CTableHeaderCell scope="col">#</CTableHeaderCell>
      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
      {<CTableHeaderCell scope="col">CabType</CTableHeaderCell>}
      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
      <CTableHeaderCell scope="col">Dob</CTableHeaderCell>
      <CTableHeaderCell scope="col">City</CTableHeaderCell>
      <CTableHeaderCell scope="col">State</CTableHeaderCell>
      <CTableHeaderCell scope="col">Country</CTableHeaderCell>
      <CTableHeaderCell scope="col">PostalCode</CTableHeaderCell>
      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
      <CTableHeaderCell scope='col'>Actions</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
    {driverData.map((user,index)=>(
        <CTableRow key={index}>
            <CTableDataCell scope='row'>{index + 1}</CTableDataCell>
            <CTableDataCell>{user.name}</CTableDataCell>
            {<CTableDataCell>{user?.cabInfo[0]?.type}</CTableDataCell>}
            <CTableDataCell>{user.email}</CTableDataCell>
            <CTableDataCell>{user.dob}</CTableDataCell>
            <CTableDataCell>{user.location.city}</CTableDataCell>
            <CTableDataCell>{user.location.state}</CTableDataCell>
            <CTableDataCell>{user.location.country}</CTableDataCell>
            <CTableDataCell>{user.location.postalCode}</CTableDataCell>
            <CTableDataCell>{user.createdAt}</CTableDataCell>
            <CTableDataCell style={{display:"flex",gap:"10px"}}>
            <CButton color="info" onClick={()=>handleEditDriver(user)}>Edit</CButton>
            <CButton color="danger" onClick={()=>handleDelete(user._id)}>Delete</CButton>
            </CTableDataCell>          
        </CTableRow>
    ))}
  </CTableBody>
</CTable>
    

    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="VerticallyCenteredExample"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">{driverId ? "upDate Driver" : "AddDriver"}</CModalTitle>
      </CModalHeader>
      {errorMessage && <p style={{ color: "red",marginLeft:"50" }}>{errorMessage}</p>}
      <CModalBody>
            <CForm noValidate validated={validated}onSubmit={handleSubmit}>
            <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Name"
                       autoComplete="name" 
                       feedbackInvalid ="Field Required"
                       required
                       name='name'
                       value={userData.name}
                       onChange={handleChange}
                       />
                    </CInputGroup>
                    {/* { <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="CabType"
                        autoComplete="CabType"
                        feedbackInvalid ="Field Required"
                        required
                        name='type'
                        value={userData.cabId}
                        onChange={handleChange}
                      /> </CInputGroup>} */}
                      <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        feedbackInvalid ="Field Required"
                        required
                        name='email'
                        value={userData.email}
                        onChange={handleChange}
                      /> </CInputGroup>

                    {driverId ? (""):(
                         <CInputGroup className="mb-4">
                           <CInputGroupText>
                             <CIcon icon={cilLockLocked} />
                           </CInputGroupText>
                           <CFormInput
                             type="password"
                             placeholder="Password"
                             autoComplete="Password"
                             feedbackInvalid ="Field Required"
                             required
                             name='password'
                             value={userData.password}
                             onChange={handleChange}
                           />
                         </CInputGroup>
                    )}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="date"
                        placeholder="Dob"
                        autoComplete="dob"
                        feedbackInvalid ="Field Required"
                        required
                        name='dob'
                        value={userData.dob}
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilAddressBook} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="City"
                        autoComplete="City"
                        feedbackInvalid ="Field Required"
                        required
                        name='city'
                        value={userData?.location?.city}
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilAddressBook} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="State"
                        autoComplete="state"
                        feedbackInvalid ="Field Required"
                        required
                        name='state'
                        value={userData?.location?.state}
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilAddressBook} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Country"
                        autoComplete="country"
                        feedbackInvalid ="Field Required"
                        required
                        name='country'
                        value={userData?.location?.country}
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilAddressBook} />
                      </CInputGroupText>
                      <CFormInput
                        type="number"
                        placeholder="PostalCode"
                        autoComplete="postalcode"
                        feedbackInvalid ="Field Required"
                        required
                        name='postalCode'
                        value={userData?.location?.postalCode}
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <CButton color="primary" type='submit' style={{float :"right"}}>Submit</CButton>
            </CForm>
      </CModalBody>
    </CModal>

    <CModal
      alignment="center"
      visible={visiblee}
      onClose={() => setVisiblee(false)}
      aria-labelledby="VerticallyCenteredExample"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredExample">Delete Cab</CModalTitle>
      </CModalHeader>
      <CModalBody>
                Are You Sure Delete the Cab..
      </CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={driverDelete}>
          Delete
        </CButton>
      
      </CModalFooter>
    </CModal>
    
    </>
  )
}

export default Drivers;