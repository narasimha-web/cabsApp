import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CContainer,
  CCol,
  CButton,
  CRow,
  CModalTitle,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Cabs = () => {
  const [cabData, setCabData] = useState([])
  const [visible, setVisible] = useState(false)
  const [validated, setValidated] = useState(false)
  const [cabId, setCabId] = useState(null)
  const [visiblee, setVisiblee] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [cabDriverData, setCabDriverData] = useState([])
  const [cabUserData, setCabUserData] = useState({
    driverId: '',
    type: '',
    regNo: '',
  })
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)

  // cab drivers new

  const cabDrivers = async () => {
    try {
      if (token) {
        const responce = await fetch('http://localhost:8000/api/cabDriver', {
          method: 'GET',
          headers: {
            'x-token': token,
          },
        })

        if (responce.ok) {
          const data = await responce.json()
          setCabDriverData(data.responce)
        } else {
          console.log('Failed to fetch cab drivers. Status:', responce.status)
        }
      } else {
        console.log('No token found. Please log in.')
      }
    } catch (err) {
      console.log('Error:', err)
    }
  }

  // fetch cabs Data
  const fetchCabs = async (index = 0) => {
    try {
      if (token) {
        const response = await fetch(
          `http://localhost:8000/api/cabs?page=${index + 1}&pageSize=${pageSize}`,
          {
            method: 'GET',
            headers: {
              'x-token': token,
            },
          },
        )
        if (response.ok) {
          const data = await response.json()
          setCabData(data.data)
          setPageCount(data.pageCount)
        }
      } else {
        console.log('token not found')
      }
    } catch (err) {
      console.log(err)
      setErrorMessage('Failed to fetch cabs.')
    }
  }
  useEffect(() => {
    fetchCabs(currentPage)
  }, [token, currentPage, pageSize])

  const onPageChange = (index) => {
    if (index >= 0 && index < pageCount) {
      setCurrentPage(index)
    }
  }

  useEffect(() => {
    cabDrivers()
  }, [token])
  //---------------------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target
    setCabUserData({
      ...cabUserData,
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
    const url = cabId
      ? `http://localhost:8000/api/editCab/${cabId}`
      : 'http://localhost:8000/api/savedcab'
    const method = cabId ? 'PUT' : 'POST'

    try {
      if (token) {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-token': token, // Token included in the headers
          },
          body: JSON.stringify(cabUserData),
        })

        if (response.ok) {
          const data = await response.json()
          setVisible(false) // Close modal
          setCabUserData({ driverId: '', type: '', regNo: '' })
          setCabId(null) // Reset Cab ID
          setValidated(false) // Reset form validation
          fetchCabs() // Refresh the cab list
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`)
        }
      } else {
        console.warn('Token not found')
      }
    } catch (err) {
      console.log(err)
    }
  }
  //-------Edit Cab-----------------------------------
  const editCab = (data) => {
    setVisible(true)
    setCabId(data._id) // Corrected to setCabId
    setCabUserData({
      driverId: data.driverId,
      type: data.type,
      regNo: data.regNo,
    })
    fetchCabs()
  }
  //------------------ Delete Cab----------------------
  const handleDelete = async (id) => {
    setVisiblee(true)
    setDeleteId(id)
  }

  const cabDelete = async () => {
    try {
      if (token) {
        const response = await fetch(`http://localhost:8000/api/cabDelete/${deleteId}`, {
          method: 'DELETE',
          headers: {
            'x-token': token,
          },
        })
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          setVisiblee(false)
          fetchCabs()
        }
      } else {
        console.log('Token Not Found')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <CContainer>
        <CRow>
          <CCol />
          <CCol>
            <CButton
              color="primary"
              style={{ float: 'right', marginRight: '10px', marginBottom: '10px' }}
              onClick={() => setVisible(!visible)}
            >
              New
            </CButton>
          </CCol>
        </CRow>
        <CTable striped hover bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">DriverName</CTableHeaderCell>
              <CTableHeaderCell scope="col">Type</CTableHeaderCell>
              <CTableHeaderCell scope="col">RegNo</CTableHeaderCell>
              <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {cabData.map((user, index) => (
              <CTableRow key={(user._id, index)}>
                {' '}
                {/* Use unique id as key */}
                <CTableDataCell scope="row">
                  {cabData.indexOf(user) + 1 + currentPage * pageSize}
                </CTableDataCell>
                <CTableDataCell>{user.driverInfo[0].name}</CTableDataCell>
                <CTableDataCell>{user.type}</CTableDataCell>
                <CTableDataCell>{user.regNo}</CTableDataCell>
                <CTableDataCell style={{ display: 'flex', gap: '10px' }}>
                  <CButton color="info" onClick={() => editCab(user)}>
                    Edit
                  </CButton>
                  <CButton color="danger" onClick={() => handleDelete(user._id)}>
                    Delete
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
      <CModal
        alignment="center"
        visible={visible}
        onClose={() => {
          setVisible(false)
          setCabUserData({ driverId: '', type: '', regNo: '' })
          setValidated(false)
        }}
        aria-labelledby="VerticallyCenteredExample"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredExample">
            {cabId ? 'UpDate Cab' : 'Add driver'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <CInputGroup className="mb-3">
              <CFormSelect
                size="lg"
                className="mb-3"
                aria-label="Large select example"
                name="driverId"
                value={cabUserData.driverId}
                onChange={handleChange}
              >
                <option>cabId</option>
                {cabDriverData.map((cabData) => (
                  <option key={cabData._id} value={cabData._id}>
                    {cabData._id}
                  </option>
                ))}
              </CFormSelect>
            </CInputGroup>
            <CInputGroup>
              <CFormSelect
                size="lg"
                className="mb-3"
                aria-label="Small select example"
                name="type"
                value={cabUserData.type}
                onChange={handleChange}
              >
                <option>CarType</option>
                <option value="bike">bike</option>
                <option value="car">car</option>
                <option value="auto">auto</option>
                <option value="bus">bus</option>
              </CFormSelect>
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Reg No"
                autoComplete="regno"
                feedbackInvalid="Field Required"
                required
                name="regNo"
                value={cabUserData.regNo}
                onChange={handleChange}
              />
            </CInputGroup>

            <CButton color="secondary" type="submit" style={{ float: 'right' }}>
              Submit
            </CButton>
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
        <CModalBody>Are You Sure Delete the Cab..</CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={cabDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Cabs
