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

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id_categoria: "",
    nombre_categoria: "",
  });

  const fetchCategorias = async () => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    llamadaApi(servidores, 0, { method: 'get', url: '/api/categorias', headers }, (data) => {
      const { listaCategorias } = data;
      if (Array.isArray(listaCategorias)) {
        setCategorias(listaCategorias);
      } else {
        console.error("Estructuración de los datos incorrectos");
      }
    }, (error) => {
      console.error("Error obtención de datos:", error);
    });
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleDelete = async (id) => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
      id_categoria: id,
    };

    llamadaApi(servidores, 0, { method: 'delete', url: `/api/categorias/${id}`, headers }, () => {
      fetchCategorias();
    }, (error) => {
      console.error("Error al eliminar el categoria:", error);
    });
  };

  const handleUpdate = (categoria) => {
    setCurrentCategory(categoria);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentCategory({
      id_categoria: "",
      nombre_categoria: "",
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
    const url = isEditing ? `/api/categorias/${currentCategory.id_categoria}` : '/api/categorias';
    
    llamadaApi(servidores, 0, { method, url, data: currentCategory, headers }, () => {
      fetchCategorias();
      setShowModal(false);
    }, (error) => {
      if (error.response && error.response.data) {
        console.error("Error al guardar la categoria:", error.response.data);
      } else {
        console.error("Error al guardar la categoria:", error);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value,
    });
  };

  return (
    <div className="d-flex align-items-center justify-content-center mt-3 flex-column">
      <p className="fs-4" style={{ color: "#843C0C" }}>
        Gestión de Categorias
      </p>
      <Button className="mb-3 btn btn-success" onClick={handleAdd}>
        Agregar una categoria
      </Button>
      <div className="card" style={{ maxHeight: "75vh", overflowY: "scroll" }}>
        <table className="table">
          <thead>
            <tr>
              <th className="d-none">#</th>
              <th>CATEGORIAS</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria, index) => (
              <tr key={index}>
                <td className="d-none">{categoria.id_categoria}</td>
                <td>{categoria.nombre_categoria}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(categoria.id_categoria)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleUpdate(categoria)}
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
            {isEditing ? "Actualizar Categoria" : "Agregar Categoria"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type="text"
                name="nombre_categoria"
                value={currentCategory.nombre_categoria}
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

export default Categorias;
