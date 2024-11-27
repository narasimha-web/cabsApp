import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { CIcon } from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const [avatar, setAvatar] = useState('')
  useEffect(() => {
    const storedImage = localStorage.getItem('image')
    if (storedImage) {
      setAvatar(JSON.parse(storedImage))
    }
  }, [])

  const navigate = useNavigate()
  const handleOut = () => {
    localStorage.removeItem('authToken')
    navigate('/Login')
  }
  const handleChange = () => {
    navigate('/profile')
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem
          onClick={handleOut}
          style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}
        >
          {' '}
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
        <CDropdownItem
          onClick={handleChange}
          style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}
        >
          {' '}
          <CIcon icon={cilUser} className="me-2" />
          My Pfofile
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
