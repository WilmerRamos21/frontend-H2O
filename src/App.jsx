import { BrowserRouter, Routes, Route } from "react-router-dom"

// 1. Importa el Provider
import { CartProvider } from "./context/CartContext" 

// Importaciones de Componentes y Páginas
import Navbar from "./components/Navbar"
import { HomePage } from './pages/HomePage'
import { Confirm } from './pages/Confirm'
import { Forgot } from './pages/Forgot'
import { Reset } from './pages/Reset'
import { ProfilePage } from './pages/Profile'
import { AdministradorPage } from './pages/Administrador'
import { EmployeePage } from './pages/Employee'
import ProtectedRoute from './routes/ProtectedRoute'
import { ProductDetailPage } from "./pages/ProductDetail"
import { CartDrawer } from "./components/cart/cardDrawer"
import {Checkout}  from "./pages/Checkout"
import { OrderSuccess } from "./pages/OrderSuccess"
import storeAuth from "./context/storeAuth"
import {Footer} from './components/Footer'
import { PrivacyPage } from "./pages/Privacy"
import { TermsPage } from "./pages/Terms"



function App() {
  const user = storeAuth((state) => state.user);
  return (
    <BrowserRouter>
      {/* 2. Envolvemos TODO el contenido con CartProvider */}
      <CartProvider>
        
        <Navbar />
        <CartDrawer />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          
          <Route path="confirmar/:token" element={<Confirm/>}/>
          <Route path='recuperarpassword' element={<Forgot/>}/>
          <Route path='recuperarpassword/:token' element={<Reset/>}/>
          <Route path='/terminos-condiciones' element={<TermsPage/>}/>
          <Route path="/politica-privacidad" element={<PrivacyPage />} />

          <Route path='producto/:id' element={<ProductDetailPage/>}/>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute/>}>
            <Route path='perfil' element={<ProfilePage/>}/>
            <Route path='checkout' element={<Checkout/>}/>
            <Route path='confirmacion-pago' element={<OrderSuccess/>}/>
          </Route>

          {/* Rutas exclusivas para administradores */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path='administrador' element={<AdministradorPage/>}/>
          </Route>

          {/* Rutas exclusivas para empleados*/}
          <Route element={<ProtectedRoute allowedRoles={["EMPLEADO"]} />}>
            <Route path='empleado' element={<EmployeePage/>}/>
          </Route>

          <Route path="*" element={<h1 className="text-center mt-20">404 - Página no encontrada</h1>} />
        </Routes>

        <Footer/>

      </CartProvider>
    </BrowserRouter>
  )
}

export default App