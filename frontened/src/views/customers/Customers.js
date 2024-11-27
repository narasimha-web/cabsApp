import React, { useState, useEffect, useContext } from 'react'
import {
  CContainer,
  CTable,
  CTableHead,
  CTableRow,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CRow,
  CCol,
  CInputGroup,
  CFormInput,
  CForm,
} from '@coreui/react'
import { store } from '../../App'

const Customers = () => {
  const [customerData, setCustomerData] = useState([])
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [validated, setValidated] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
  })
  const [searchCustomer, setSearchCustomer] = useContext(store)
  useEffect(() => {
    if (searchCustomer) {
      setTimeout(() => {
        setCustomerData([]), setCustomerData(searchCustomer)
      }, 500)
    }
  }, [searchCustomer])

  const fetchCustomers = async (index = 0) => {
    try {
      if (token) {
        const response = await fetch(
          `http://localhost:8000/api/fetchCustomers?${index + 1}&pageSize=${pageSize}`,
          {
            method: 'GET',
            headers: {
              'x-token': token,
            },
          },
        )
        if (response.ok) {
          const data = await response.json()
          setCustomerData(data.data)
          setPageCount(data.pageCount)
        }
      } else {
        alert('Token Not Found')
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchCustomers(currentPage)
  }, [token, currentPage, pageSize])

  const onPageChange = (index) => {
    if (index >= 0 && index < pageCount) {
      setCurrentPage(index)
    }
  }
  const handleData = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }
  const handleSubmitt = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/searchCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userData.name.trim() }),
      })
      const data = await response.json()
      setTimeout(() => {
        setSearchCustomer(data.data)
      }, 500)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <CRow>
        <CCol xs lg={4}>
          <CForm onSubmit={handleSubmitt} validated={validated}>
            <CInputGroup className="mb-4">
              <CFormInput
                type="text"
                autoComplete="date"
                placeholder="Search Here.."
                feedbackInvalid="Field Required"
                name="name"
                value={userData.name}
                onChange={handleData}
                required
                style={{ width: '100px' }}
              />
              <CButton color="primary" type="submit">
                Search
              </CButton>
            </CInputGroup>
          </CForm>
        </CCol>
        <CCol></CCol>
      </CRow>
      <CContainer>
        <CTable bordered hover striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>S.No</CTableHeaderCell>
              <CTableHeaderCell>Customer Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {customerData.map((data, index) => (
              <CTableRow key={index}>
                <CTableDataCell scope="row">{index + 1 + currentPage * pageSize}</CTableDataCell>
                <CTableDataCell>{data.name}</CTableDataCell>
                <CTableDataCell>{data.email}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* pagination  */}

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
    </>
  )
}

export default Customers
