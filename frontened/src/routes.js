import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Drivers = React.lazy(() => import("./views/drivers/Drivers"));
const Cabs = React.lazy(() => import("./views/cabs/Cabs") );
const Trips = React.lazy(() => import("./views/trips/Trips"));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  {path:"/drivers", name:"Drivers", element:Drivers},
  {path:"/cabs", name:"Cabs", element:Cabs},
  {path:"/trips",name:"Trips",element:Trips}
]

export default routes;
