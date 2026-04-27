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
      {path:"book", element: <ListBooks/>},
      {path:"/book/create", element: <CreateBook/>},
      {path:"book/detail/:id", element: <DetailBook />},
      { path: "book/edit/:id", element: <UpdateBook /> },

      //Rutas User
      {path:"user/table", element: <TableUsers/>},
      {path: '/user/login',element: <Login />},
      {path: '/user/create',element: <Register />},
      {path:"user/detail/:id", element: <DetailUser />},
      {path:"user/update/:id", element: <UpdateUser />},

      //Rutas Auction
      {path:"auction/table", element: <TableAuctions/>},
      {path:"payment/table", element: <TablePayment />},
      {path:"/auction/maintenance", element: <MaintenanceAuctions/>},
      {path:"/auction/create", element: <CreateAuction />},
      {path:"auction/detail/:id", element: <DetailAuction/>},
      {path:"/auction/update/:id", element: <UpdateAuction />},
      

      //Rutas Bid
      {path:"auction/bid/detail/:id", element: <DetailBid/>},
      {path:"/auction/dobid/:id", element: <DoBids />}
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
