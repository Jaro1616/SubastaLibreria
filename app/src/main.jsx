import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
//import TableMovies from './components/Book/TableMovies'
import { ListBooks } from './components/Book/ListBooks'
import { DetailBook } from './components/Book/DetailBook'
import TableUsers from './components/User/TableUsers'
import DetailUser from './components/User/DetailUser'
import TableAuctions from './components/Auction/TableAuctions'
import DetailAuction from './components/Auction/DetailAuction'

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
      {path:"book/detail/:id", element: <DetailBook />},

      //Rutas User
      {path:"user/table", element: <TableUsers/>},
      {path:"user/detail/:id", element: <DetailUser />},

      //Eutas Auction
      {path:"auction/table", element: <TableAuctions/>},
      {path:"auction/detail/:id", element: <DetailAuction/>},
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)
