import { useState, useEffect } from "react";
import axios from "axios";
import { decryptToken } from "../../store/authSlice";
import { Modal, Button, Form } from "react-bootstrap";

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

function Compras() {
  const [compras, setCompras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShopping, setCurrentShopping] = useState({
    descripcion_producto: "",
    cantidad_comprada: "",
    nombre_proveedor: "",
  });

  const fetchCompras = async () => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    llamadaApi(servidores, 0, { method: 'get', url: '/api/compras', headers }, (data) => {
      const { listaCompras } = data;
      if (Array.isArray(listaCompras)) {
        setCompras(listaCompras);
      } else {
        console.error("Estructuración de los datos incorrectos");
      }
    }, (error) => {
      console.error("Error obtención de datos:", error);
    });
  };

  useEffect(() => {
    fetchCompras();
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

  const [proveedores, setProveedores] = useState([]);

  const fetchProveedores = async () => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    llamadaApi(servidores, 0, { method: 'get', url: '/api/seleccionarproveedores', headers }, (data) => {
      const { listaNombreProveedores } = data;
      if (Array.isArray(listaNombreProveedores[0])) {
        setProveedores(listaNombreProveedores[0]);
      } else {
        console.error("Estructuración de los datos incorrectos");
      }
    }, (error) => {
      console.error("Error obtención de datos:", error);
    });
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleDelete = async (id) => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
      id_detallecompra: id,
    };

    llamadaApi(servidores, 0, { method: 'delete', url: `/api/compras/${id}`, headers }, () => {
      fetchCompras();
    }, (error) => {
      console.error("Error al eliminar la compra:", error);
    });
  };

  const handleUpdate = (detallecompra) => {
    setCurrentShopping(detallecompra);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentShopping({
      descripcion_producto: "",
      cantidad_comprada: "",
      nombre_proveedor: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    const { descripcion_producto, cantidad_comprada, nombre_proveedor } = currentShopping;

    if (!descripcion_producto || !cantidad_comprada || !nombre_proveedor) {
      alert("Por favor, complete todos los campos requeridos");
      return;
    }

    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? `/api/compras/${currentShopping.id_detallecompra}` : '/api/compras';

    llamadaApi(servidores, 0, { method, url, data: currentShopping, headers }, () => {
      fetchCompras();
      setShowModal(false);
    }, (error) => {
      if (error.response && error.response.data) {
        console.error("Error al guardar la compra:", error.response.data);
      } else {
        console.error("Error al guardar la compra:", error);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentShopping({
      ...currentShopping,
      [name]: value,
    });
  };

  return (
    <div className="d-flex align-items-center justify-content-center mt-3 flex-column">
      <p className="fs-4" style={{ color: "#843C0C" }}>
        Gestión de Compras
      </p>
      <Button className="mb-3 btn btn-success" onClick={handleAdd}>
        Agregar compra
      </Button>
      <div className="card" style={{ maxHeight: "75vh", overflowY: "scroll" }}>
        <table className="table">
          <thead>
            <tr>
              <th className="d-none">#</th>
              <th>PRODUCTO</th>
              <th>CANTIDAD</th>
              <th>PRECIO COMPRA</th>
              <th>SUBTOTAL</th>
              <th>FECHA</th>
              <th>PROVEEDOR</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra, index) => (
              <tr key={index}>
                <td className="d-none">{compra.id_detallecompra}</td>
                <td>{compra.descripcion_producto}</td>
                <td>{compra.cantidad_comprada}</td>
                <td>{compra.precio_unitario}</td>
                <td>{compra.subtotal}</td>
                <td>{compra.fecha}</td>
                <td>{compra.nombre_proveedor}</td>
                <td>
                  <button className="btn btn-danger me-2" onClick={() => handleDelete(compra.id_detallecompra)}>
                    <i className="bi bi-trash3"></i>
                  </button>
                  <button className="btn btn-warning" onClick={() => handleUpdate(compra)}>
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
          <Modal.Title>{isEditing ? "Actualizar Compra" : "Agregar Compra"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Producto</Form.Label>
              <Form.Select name="descripcion_producto" value={currentShopping.descripcion_producto} className="form-control" onChange={handleChange}>
                <option>--Seleccione un producto--</option>
                {productos.map((producto, index) => (
                  <option key={index} value={producto.descripcion}>{producto.descripcion}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad_comprada"
                value={currentShopping.cantidad_comprada}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Proveedores</Form.Label>
              <Form.Select name="nombre_proveedor" value={currentShopping.nombre_proveedor} className="form-control" onChange={handleChange}>
                <option>--Seleccione el proveedor--</option>
                {proveedores.map((proveedor, index) => (
                  <option key={index} value={proveedor.nombre_proveedor}>{proveedor.nombre_proveedor}</option>
                ))}
              </Form.Select>
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
  );
}

export default Compras;
