import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Inicio from './components/inicio/Inicio';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Productos from './components/productos/Productos';
import Categorias from './components/categorias/Categorias';
import Marcas from './components/marcas/Marcas';
import Proveedores from './components/proveedores/Proveedores';
import Ventas from './components/ventas/Ventas';
import Compras from './components/compras/Compras';

const AppLayout = () => (
  <div>
    <Header />
    <Outlet />
  </div>
);

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<ProtectedRoute element={Login} />} />
        <Route element={<ProtectedRoute element={AppLayout} />}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/productos" element={<Productos/>} />
          <Route path="/categorias" element={<Categorias/>} />
          <Route path="/marcas" element={<Marcas/>}/>
          <Route path="/proveedores" element={<Proveedores/>} />
          <Route path="/ventas" element={<Ventas/>} />
          <Route path="/compras" element={<Compras/>} />
          <Route path="*" element={<Navigate to="/inicio" />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
