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

function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMarca, setCurrentMarca] = useState({
    id_marca: "",
    nombre_marca: "",
  });

  const fetchMarcas = async () => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    llamadaApi(servidores, 0, { method: 'get', url: '/api/marcas', headers }, (data) => {
      const { listaMarcas } = data;
      if (Array.isArray(listaMarcas)) {
        setMarcas(listaMarcas);
      } else {
        console.error("Estructuración de los datos incorrectos");
      }
    }, (error) => {
      console.error("Error obtención de datos:", error);
    });
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  const handleDelete = async (id) => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
      id_marca: id,
    };

    llamadaApi(servidores, 0, { method: 'delete', url: `/api/marcas/${id}`, headers }, () => {
      fetchMarcas();
    }, (error) => {
      console.error("Error al eliminar la marca:", error);
    });
  };

  const handleUpdate = (marca) => {
    setCurrentMarca(marca);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentMarca({
      id_marca: "",
      nombre_marca: "",
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
    const url = isEditing ? `/api/marcas/${currentMarca.id_marca}` : '/api/marcas';
    
    llamadaApi(servidores, 0, { method, url, data: currentMarca, headers }, () => {
      fetchMarcas();
      setShowModal(false);
    }, (error) => {
      if (error.response && error.response.data) {
        console.error("Error al guardar la marca:", error.response.data);
      } else {
        console.error("Error al guardar la marca:", error);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentMarca({
      ...currentMarca,
      [name]: value,
    });
  };

  return (
    <div className="d-flex align-items-center justify-content-center mt-3 flex-column">
      <p className="fs-4" style={{ color: "#843C0C" }}>
        Gestión de Marcas
      </p>
      <Button className="mb-3 btn btn-success" onClick={handleAdd}>
        Agregar una marca
      </Button>
      <div className="card" style={{ maxHeight: "75vh", overflowY: "scroll" }}>
        <table className="table">
          <thead>
            <tr>
              <th className="d-none">#</th>
              <th>MARCAS</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((marca, index) => (
              <tr key={index}>
                <td className="d-none">{marca.id_marca}</td>
                <td>{marca.nombre_marca}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(marca.id_marca)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleUpdate(marca)}
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
            {isEditing ? "Actualizar Marca" : "Agregar Marca"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                name="nombre_marca"
                value={currentMarca.nombre_marca}
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

export default Marcas;
