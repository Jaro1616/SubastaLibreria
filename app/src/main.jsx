import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from "./components/ui/sonner";
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
//import TableMovies from './components/Book/TableMovies'
import { ListBooks } from './components/Book/ListBooks'
import { DetailBook } from './components/Book/DetailBook'
import TableUsers from './components/User/TableUsers'
import DetailUser from './components/User/DetailUser'
import TableAuctions from './components/Auction/TableAuctions'
import MaintenanceAuctions from './components/Auction/MaintenanceAuctions'
import DetailAuction from './components/Auction/DetailAuction'
import DetailBid from './components/Auction/Bid/DetailBid'
//import CreateAuction from './components/Auction/CreateAuction'
import { UpdateUser } from './components/User/UpdateUser'
import { CreateBook } from './components/Book/CreateBook'
import { UpdateBook } from './components/Book/UpdateBook'
import { CreateAuction } from './components/Auction/CreateAuction'
import { UpdateAuction } from './components/Auction/UpdateAuction';
import { DoBids } from './components/Auction/Bid/DoBids';
import TablePayment from './components/Payment/TablePayment'
import Login from './components/User/Login'
import Register from './components/User/Register'

import { RoleRoute } from "@/components/Auth/RoleRoute";

const rutas = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      // Ruta principal
      { index: true, element: <Home /> },

      // Ruta comodín (404)
      { path: "*", element: <PageNotFound /> },
      
       //Rutas Book
      //{path:"book/table", element: <TableMovies/>},
      {path:"book", element: <RoleRoute requiredRoles={["Vendedor", "Administrador"]}> <ListBooks/> </RoleRoute>},
      {path:"/book/create", element: <RoleRoute requiredRoles={["Vendedor", "Administrador"]}> <CreateBook/> </RoleRoute>},
      {path:"book/detail/:id", element: <RoleRoute requiredRoles={["Vendedor", "Administrador"]}> <DetailBook /> </RoleRoute>},
      {path:"book/edit/:id", element: <RoleRoute requiredRoles={["Vendedor", "Administrador"]}> <UpdateBook /> </RoleRoute>},

      //Rutas User
      {path:"user/table", element: <RoleRoute requiredRoles={["Administrador"]}> <TableUsers/> </RoleRoute>},
      {path: '/user/login',element: <Login />},
      {path: '/user/create',element: <Register />},
      {path:"user/detail/:id", element: <RoleRoute requiredRoles={["Administrador"]}> <DetailUser /> </RoleRoute>},
      {path:"user/update/:id", element: <RoleRoute requiredRoles={["Administrador"]}> <UpdateUser /> </RoleRoute>},

      //Rutas Auction
      {path:"auction/table", element: <RoleRoute requiredRoles={["Comprador", "Administrador", "Vendedor"]}> <TableAuctions/> </RoleRoute>},
      {path:"payment/table", element: <RoleRoute requiredRoles={["Comprador", "Administrador"]}> <TablePayment /> </RoleRoute>},
      {path:"/auction/maintenance", element: <RoleRoute requiredRoles={["Vendedor", "Administrador"]}> <MaintenanceAuctions/> </RoleRoute>},
      {path:"/auction/create", element: <RoleRoute requiredRoles={["Vendedor", "Administrador"]}> <CreateAuction /> </RoleRoute>},
      {path:"auction/detail/:id", element: <RoleRoute requiredRoles={["Comprador", "Administrador", "Vendedor"]}> <DetailAuction/> </RoleRoute>},
      {path:"/auction/update/:id", element: <RoleRoute requiredRoles={["Vendedor", "Administrador"]}><UpdateAuction /></RoleRoute>},
      

      //Rutas Bid
      {path:"auction/bid/detail/:id", element: <RoleRoute requiredRoles={["Vendedor", "Administrador", "Comprador"]}><DetailBid/></RoleRoute>},
      {path:"/auction/dobid/:id", element: <RoleRoute requiredRoles={["Comprador", "Administrador"]}><DoBids /></RoleRoute>}
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
    <RouterProvider router={rutas} />
    <Toaster />
    </>
  </StrictMode>,
)
