import { useState, useEffect } from "react";
import axios from "axios";
import { decryptToken } from "../../store/authSlice";
import { Modal, Button, Form } from "react-bootstrap";
import Totalventas from "../ventas/Totalventas";

const servidores = [
  "http://172.168.2.44:3000",
  "http://172.168.0.35:3000",
  "http://172.168.3.242:3000",
  "http://172.168.3.90:3000",
];

const llamadaApi = async (Url_servers, index, options, onSuccess, onError) => {
    try {
        const response = await axios({ ...options, url: Url_servers[index] + options.url });
        onSuccess(response.data);
    } catch (error) {
        if (index < Url_servers.length - 1) {
            llamadaApi(Url_servers, index + 1, options, onSuccess, onError);
        } else {
            console.error("All servers are unreachable");
            if (onError) onError(error);
        }
    }
};

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSales, setCurrentSales] = useState({
    id_detalleventa: "",
    descripcion_producto: "",
    cantidad_vendida: "",
    id_producto: "",
  });

  const fetchVentas = async () => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    llamadaApi(servidores, 0, { method: 'get', url: '/api/ventas', headers }, (data) => {
      const { listaVentas } = data;
      if (Array.isArray(listaVentas)) {
        setVentas(listaVentas);
      } else {
        console.error("Estructuración de los datos incorrectos");
      }
    }, (error) => {
      console.error("Error obtención de datos:", error);
    });
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const [productos, setProductos] = useState([]);

  const fetchProductos = async () => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    llamadaApi(servidores, 0, { method: 'get', url: '/api/seleccionarproductos', headers }, (data) => {
      const { listaNombreProductos } = data;
      if (Array.isArray(listaNombreProductos[0])) {
        setProductos(listaNombreProductos[0]);
      } else {
        console.error("Estructuración de los datos incorrectos");
      }
    }, (error) => {
      console.error("Error obtención de datos:", error);
    });
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
      id_detalleventa: id,
    };

    llamadaApi(servidores, 0, { method: 'delete', url: `/api/ventas/${id}`, headers }, () => {
      fetchVentas();
    }, (error) => {
      console.error("Error al eliminar la venta:", error);
    });
  };

  const handleUpdate = (detalleventa) => {
    setCurrentSales(detalleventa);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentSales({
      id_detalleventa: "",
      descripcion_producto: "",
      cantidad_vendida: "",
      id_producto: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? `/api/ventas/${currentSales.id_detalleventa}` : '/api/ventas';

    llamadaApi(servidores, 0, { method, url, data: currentSales, headers }, () => {
      fetchVentas();
      setShowModal(false);
    }, (error) => {
      if (error.response && error.response.data) {
        console.error("Error al guardar la venta:", error.response.data);
      } else {
        console.error("Error al guardar la venta:", error);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSales({
      ...currentSales,
      [name]: value,
    });
  };

  return (
    <div>
      <p className="text-center fs-4 mt-2" style={{ color: "#843C0C" }}>
        Gestión de Ventas
      </p>
      <div className="d-flex align-items-center justify-content-center gap-3">
        <div className="d-flex align-items-center justify-content-center">
          <Totalventas />
        </div>
        <div className="d-flex align-items-center justify-content-center mt-2 flex-column">
          <Button className="mb-3 btn btn-success" onClick={handleAdd}>
            Agregar venta
          </Button>
          <div className="card" style={{ maxHeight: "75vh", overflowY: "scroll" }}>
            <table className="table">
              <thead>
                <tr>
                  <th className="d-none">#</th>
                  <th>PRODUCTO</th>
                  <th>CANTIDAD</th>
                  <th>PRECIO VENTA</th>
                  <th>SUBTOTAL</th>
                  <th>FECHA</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta, index) => (
                  <tr key={index}>
                    <td className="d-none">{venta.id_detalleventa}</td>
                    <td>{venta.descripcion_producto}</td>
                    <td>{venta.cantidad_vendida}</td>
                    <td>{venta.precio_unitario}</td>
                    <td>{venta.subtotal}</td>
                    <td>{venta.fecha}</td>
                    <td>
                      <button className="btn btn-danger me-2" onClick={() => handleDelete(venta.id_detalleventa)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                      <button className="btn btn-warning" onClick={() => handleUpdate(venta)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{isEditing ? "Actualizar Venta" : "Agregar Venta"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Producto</Form.Label>
                  <Form.Select
                    name="descripcion_producto"
                    value={currentSales.descripcion_producto}
                    className="form-control"
                    onChange={handleChange}
                  >
                    <option>--Seleccione un producto--</option>
                    {productos.map((producto, index) => (
                      <option key={index} value={producto.descripcion}>
                        {producto.descripcion}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="cantidad_vendida"
                    value={currentSales.cantidad_vendida}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Guardar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Ventas;