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

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    id_proveedor: "",
    nombre_proveedor: "",
    telefono_proveedor: "",
    direccion_proveedor: "",
  });

  const fetchProveedores = async () => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    llamadaApi(servidores, 0, { method: 'get', url: '/api/proveedores', headers }, (data) => {
      const { listaProveedores } = data;
      if (Array.isArray(listaProveedores)) {
        setProveedores(listaProveedores);
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
      id_proveedor: id,
    };

    llamadaApi(servidores, 0, { method: 'delete', url: `/api/proveedores/${id}`, headers }, () => {
      fetchProveedores();
    }, (error) => {
      console.error("Error al eliminar el proveedor:", error);
    });
  };

  const handleUpdate = (proveedor) => {
    setCurrentSupplier(proveedor);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentSupplier({
      id_proveedor: "",
      nombre_proveedor: "",
      telefono_proveedor: "",
      direccion_proveedor: "",
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
    const url = isEditing ? `/api/proveedores/${currentSupplier.id_proveedor}` : '/api/proveedores';
    
    llamadaApi(servidores, 0, { method, url, data: currentSupplier, headers }, () => {
      fetchProveedores();
      setShowModal(false);
    }, (error) => {
      if (error.response && error.response.data) {
        console.error("Error al guardar el proveedor:", error.response.data);
      } else {
        console.error("Error al guardar el proveedor:", error);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier({
      ...currentSupplier,
      [name]: value,
    });
  };

  return (
    <div className="d-flex align-items-center justify-content-center mt-3 flex-column">
      <p className="fs-4" style={{ color: "#843C0C" }}>
        Gestión de Proveedores
      </p>
      <Button className="mb-3 btn btn-success" onClick={handleAdd}>
        Agregar un proveedor
      </Button>
      <div className="card" style={{ maxHeight: "75vh", overflowY: "scroll" }}>
        <table className="table">
          <thead>
            <tr>
              <th className="d-none">#</th>
              <th>PROVEEDOR</th>
              <th>TELÉFONO</th>
              <th>DIRECCIÓN</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor, index) => (
              <tr key={index}>
                <td className="d-none">{proveedor.id_proveedor}</td>
                <td>{proveedor.nombre_proveedor}</td>
                <td>{proveedor.telefono_proveedor}</td>
                <td>{proveedor.direccion_proveedor}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(proveedor.id_proveedor)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleUpdate(proveedor)}
                  >
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
          <Modal.Title>
            {isEditing ? "Actualizar Proveedor" : "Agregar Proveedor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Proveedor</Form.Label>
              <Form.Control
                type="text"
                name="nombre_proveedor"
                value={currentSupplier.nombre_proveedor}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono_proveedor"
                value={currentSupplier.telefono_proveedor}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion_proveedor"
                value={currentSupplier.direccion_proveedor}
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
  );
}

export default Proveedores;

