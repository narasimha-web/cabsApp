import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const handleOut = () =>{
    localStorage.removeItem("authToken");
    navigate('/Login')
  };
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem onClick ={handleOut} style={{ color: 'black', textDecoration: 'none',cursor:"pointer" }}>
            {' '}
            <CIcon icon={cilLockLocked} className="me-2" />
            Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
    
  )
}

export default AppHeaderDropdown;
