import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Drivers = React.lazy(() => import('./views/drivers/Drivers'))
const Cabs = React.lazy(() => import('./views/cabs/Cabs'))
const Trips = React.lazy(() => import('./views/trips/Trips'))
const Customers = React.lazy(() => import('./views/customers/Customers'))
const Profile = React.lazy(() => import('./views/profile/Profile'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/drivers', name: 'Drivers', element: Drivers },
  { path: '/customers', name: 'Customers', element: Customers },
  { path: '/cabs', name: 'Cabs', element: Cabs },
  { path: '/trips', name: 'Trips', element: Trips },
  { path: '/profile', name: 'Profile', element: Profile },
]

export default routes
