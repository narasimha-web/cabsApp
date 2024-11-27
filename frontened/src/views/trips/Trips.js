/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CRow,
  CCol,
  CButton,
  CContainer,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CForm,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCarAlt } from '@coreui/icons'
import { store } from '../../App'

const Trips = () => {
  const [visible, setVisible] = useState(false)
  const [customerData, setCustomerData] = useState([])
  const [driverData, setDriverData] = useState([])
  const [validated, setValidated] = useState(false)
  const [tripsData, setTripsData] = useState([])
  const [userData, setUserData] = useState({
    customerId: '',
    driverId: '',
    paymentType: '',
    amount: '',
    status: '',
    source: '',
    destination: '',
  })
  const [createdAt, setCreatedAt] = useState({
    date: ' ',
  })
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [tripId, setTripid] = useState(null)
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [findDate, setFindDate] = useContext(store)

  useEffect(() => {
    if (findDate) {
      setTimeout(() => {
        setTripsData([])
        setTripsData(findDate)
      }, 500)
    }
  }, [findDate])
  //------------------fetchCustomers----------------------------------
  const fetchCustomers = async () => {
    try {
      if (token) {
        const responce = await fetch('http://localhost:8000/api/fetchCustomers', {
          method: 'GET',
          headers: {
            'x-token': token,
          },
        })
        if (responce.ok) {
          const data = await responce.json()
          setCustomerData(data.data)
        }
      } else {
        console.log('Token Not Found..')
      }
    } catch (err) {
      console.log(err)
    }
  }
  //--------------------------------------fetch Drivers----------------------------
  const fetchDreivers = async () => {
    try {
      if (token) {
        const responce = await fetch('http://localhost:8000/api/drivers', {
          method: 'GET',
          headers: {
            'x-token': token,
          },
        })
        if (responce.ok) {
          const data = await responce.json()
          setDriverData(data.data)
        }
      } else {
        console.log('Token Not Found')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }
    console.log(userData)
    // to sending the data into database
    const url = tripId
      ? `http://localhost:8000/api/editTrip/${tripId}`
      : 'http://localhost:8000/api/savedTrips'
    const method = tripId ? 'PUT' : 'POST'
    try {
      if (token) {
        const responce = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-token': token,
          },
          body: JSON.stringify(userData),
        })
        if (responce.ok) {
          const data = await responce.json()
          setVisible(false)
          setValidated(false)
          setUserData({
            customerId: '',
            driverId: '',
            paymentType: '',
            amount: '',
            status: '',
            source: '',
            destination: '',
          })
          setTripid(null)
          fetchTrips()
        }
      } else {
        alert('Token Not Found')
      }
    } catch (err) {
      console.log(err)
    }
  }
  const editTrips = (tripData) => {
    setVisible(true)
    setTripid(tripData._id)
    setUserData({
      customerId: tripData?.customerDetails[0]?._id || '',
      driverId: tripData?.driverDetails[0]?._id,
      paymentType: tripData.paymentDetails[0].method,
      amount: tripData.paymentDetails[0].amount,
      status: tripData.status,
      source: tripData.source,
      destination: tripData.destination,
    })
  }
  //------------------fetchTrips------------------------------------------------
  const fetchTrips = async (index = 0) => {
    try {
      if (token) {
        const response = await fetch(
          `http://localhost:8000/api/trips?page=${index + 1}&pageSize=${pageSize}`,
          {
            method: 'GET',
            headers: {
              'x-token': token,
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          setTripsData(data.data)
          setPageCount(data.pageCount)
        } else {
          console.error('Failed to fetch trips')
        }
      } else {
        console.log('Token Not Found..')
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchDreivers()
    fetchCustomers()
  }, [])

  useEffect(() => {
    fetchTrips(currentPage) // Fetch trips based on current page
  }, [currentPage, pageSize]) // Re-fetch data on page or pageSize change

  const onPageChange = (index) => {
    if (index >= 0 && index < pageCount) {
      setCurrentPage(index)
    }
  }

  const handleClick = (e) => {
    const { name, value } = e.target
    setCreatedAt({
      ...createdAt,
      [name]: value,
    })
  }

  const handleSubmiting = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/findDate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ createdAt: createdAt.date }),
      })

      // Wait for the response and parse it
      const data = await response.json()
      console.log(data)
      setTimeout(() => {
        setFindDate(data.data)
      }, 500)

      if (data.status === 1) {
        alert('No Records In The Fields:')
      } else {
        console.log('Error:', data.message)
      }
    } catch (err) {
      console.error('Request failed:', err)
    }
  }

  return (
    <>
      <CRow>
        <CCol xs lg={4}>
          <CForm onSubmit={handleSubmiting} validated={validated}>
            <CInputGroup className="mb-4">
              <CFormInput
                type="date"
                autoComplete="date"
                feedbackInvalid="Field Required"
                name="date"
                value={createdAt.date}
                onChange={handleClick}
                required
                style={{ width: '100px' }}
              />
              <CButton color="primary" type="submit">
                Search
              </CButton>
            </CInputGroup>
          </CForm>
        </CCol>
        <CCol>
          <CButton
            color="primary"
            style={{ float: 'right', marginRight: '30px', width: '160px', marginBottom: '10px' }}
            onClick={() => {
              setVisible(true)
            }}
          >
            <CIcon icon={cilCarAlt} /> New Trip
          </CButton>
        </CCol>
      </CRow>

      <CContainer>
        <CTable bordered hover striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>S.No</CTableHeaderCell>
              <CTableHeaderCell>Customer Name</CTableHeaderCell>
              <CTableHeaderCell>Driver Name</CTableHeaderCell>
              <CTableHeaderCell>Payment Type</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Source</CTableHeaderCell>
              <CTableHeaderCell>Destination</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {tripsData.map((trips, index) => (
              <CTableRow key={index}>
                <CTableDataCell scope="row">{index + 1 + currentPage * pageSize}</CTableDataCell>
                <CTableDataCell>{trips?.customerDetails[0]?.name}</CTableDataCell>
                <CTableDataCell>{trips?.driverDetails[0]?.name}</CTableDataCell>
                <CTableDataCell>{trips?.paymentDetails[0]?.method}</CTableDataCell>
                <CTableDataCell>{trips?.paymentDetails[0]?.amount}</CTableDataCell>
                <CTableDataCell>{trips.status}</CTableDataCell>
                <CTableDataCell>{trips.source}</CTableDataCell>
                <CTableDataCell>{trips.destination}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="danger" onClick={() => editTrips(trips)}>
                    Edit
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        {/* pagination  */}
        <CContainer>
          <CRow>
            <CCol>
              <div>
                <CButton onClick={() => onPageChange(0)} disabled={currentPage === 0}>
                  First
                </CButton>
                <CButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage == 0}>
                  Prev
                </CButton>
                {Array(pageCount)
                  .fill(null)
                  .map((_, index) => (
                    <CButton
                      key={index}
                      color={currentPage === index ? 'primary' : 'secondary'}
                      onClick={() => onPageChange(index)}
                    >
                      {index + 1}
                    </CButton>
                  ))}
                <CButton
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === pageCount - 1}
                >
                  Next
                </CButton>

                <CButton
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === pageCount - 1}
                >
                  Last
                </CButton>
              </div>
            </CCol>
            <CCol>
              <label>PageSize:</label>
              <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </CCol>
          </CRow>
        </CContainer>
      </CContainer>

      {/* ---------------------------models----------------------------------------------------- */}

      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">
            {tripId ? 'Edit Trip' : 'Add Trip'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <CInputGroup className="mb-3">
              <CFormSelect
                size="lg"
                className="mb-3"
                aria-label="Large select example"
                name="customerId"
                value={userData.customerId}
                onChange={handleChange}
              >
                <option>Customer Name</option>
                {customerData.map((user) => (
                  <option key={user.name} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </CFormSelect>
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CFormSelect
                size="lg"
                className="mb-3"
                aria-label="Large select example"
                name="driverId"
                value={userData.driverId}
                onChange={handleChange}
              >
                <option>Driver Name</option>
                {driverData.map((driver) => (
                  <option key={driver.name} value={driver._id}>
                    {driver.name}
                  </option>
                ))}
              </CFormSelect>
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CFormSelect
                size="lg"
                className="mb-3"
                aria-label="Large select example"
                name="paymentType"
                value={userData.paymentType}
                onChange={handleChange}
              >
                <option>Payment Type</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </CFormSelect>
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CFormInput
                type="number"
                placeholder="Amount"
                autoComplete="amount"
                feedbackInvalid="Field Required"
                name="amount"
                value={userData.amount}
                onChange={handleChange}
                required
              />
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CFormSelect
                size="lg"
                className="mb-3"
                aria-label="Large select example"
                name="status"
                value={userData.status}
                onChange={handleChange}
              >
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
                feedbackInvalid="Field Required"
                name="source"
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
                feedbackInvalid="Field Required"
                name="destination"
                value={userData.destination}
                onChange={handleChange}
                required
              />
            </CInputGroup>
            <CButton color="primary" type="submit" style={{ float: 'right' }}>
              Submit
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default Trips
