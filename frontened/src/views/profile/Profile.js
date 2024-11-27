import React, { useState, useEffect } from 'react'
import { CCard, CCardHeader, CCardTitle, CCardText, CCardBody, CRow, CCol } from '@coreui/react'
const Profile = () => {
  const [userData, setUserData] = useState()
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [profileImage, setProfileImage] = useState('')

  useEffect(() => {
    const storedImage = localStorage.getItem('image')
    if (storedImage) {
      setProfileImage(JSON.parse(storedImage))
    }
  }, [])

  // const image = async (req, res) => {
  //   const response = await fetch('http://localhost:8000/api/profileImage', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   const data = await response.json()
  // }
  // useEffect(() => {
  //   image()
  // }, [])

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('loginDetails'))
    if (storedUserData) {
      setUserData(storedUserData)
    }
  }, [])

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    if (!selectedFile) {
      setMessage('Please select a file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('image', selectedFile)
    try {
      const response = await fetch('http://localhost:8000/fileupload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const uploadedUrl = `http://localhost:8000/static/${data.filename}`
        localStorage.setItem('image', JSON.stringify(uploadedUrl))
        setProfileImage(uploadedUrl)
        setMessage(data.message)
        setUploadedFileName(data.filename)
        setImageUrl(uploadedUrl)
      } else {
        setMessage('Failed to upload the image.')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('An error occurred while uploading the image.')
    }
  }
  return (
    <>
      <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
        <CCard className="mb-3" style={{ maxWidth: '45rem' }}>
          <CCardHeader>Data Profile</CCardHeader>
          <CCardBody>
            <CCardText>
              <CRow>
                <CCol md={4}>
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      style={{ width: '100%', borderRadius: '8px', height: '150px' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '150px',
                        border: '1px dashed #aaa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                      }}
                    >
                      No Profile
                    </div>
                  )}
                  <button
                    style={{ marginLeft: '50px' }}
                    className="btn btn-secondary mt-3"
                    onClick={() => document.getElementById('image').click()}
                  >
                    Edit Profile
                  </button>
                </CCol>
                <CCol>
                  <h5>
                    User Name :<strong> {userData ? userData.username : ''}</strong>
                  </h5>
                  <h5>
                    Email : <strong>{userData ? userData.email : ''}</strong>
                  </h5>
                  <div className="container mt-4">
                    <div className="mb-3">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        className="form-control"
                        accept="image/jpeg,image/jpg,image/png"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </div>
                    {/* <button
                        type="submit"
                        // style={{ display: 'none' }}
                        className="btn btn-primary"
                      >
                        Change
                      </button> */}
                  </div>
                </CCol>
              </CRow>
            </CCardText>
          </CCardBody>
        </CCard>
      </div>
    </>
  )
}

export default Profile
