import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import "../header/css/header.css";


function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="navbar-container navbar_res" style={{ border: "0.2px solid #000000", backgroundColor: "#843C0C" }}>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <NavLink className="nav-link active" aria-current="page" to="/inicio">
            <div className="d-flex justify-content-center align-items-center">
            <img
              src="https://i.ibb.co/9vybH9Y/logo-ferreteria.png"
              alt="Logo"
              width="50"
              height="auto"
              className="d-inline-block align-text-top me-2"
              style={{ width: "3rem", height: "auto", objectFit: "cover" }}
            />
            <span className="navbar-logo-text text-white">Ferrexpress</span>
            </div>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
          <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link active text-white" aria-current="page" to="/productos">
                  Productos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active text-white" aria-current="page" to="/categorias">
                  Categorías
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active text-white" aria-current="page" to="/marcas">
                  Marcas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active text-white" aria-current="page" to="/proveedores">
                  Proveedores
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active text-white" aria-current="page" to="/ventas">
                  Ventas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active text-white" aria-current="page" to="/compras">
                  Compras
                </NavLink>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link active text-white logout-button">
                  Salir
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
