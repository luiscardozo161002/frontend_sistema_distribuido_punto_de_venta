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

function Productos() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id_producto: "",
    descripcion: "",
    nombre_categoria: "",
    nombre_marca: "",
    nombre_proveedor: "",
    precio_compra: "",
    precio_venta: "",
    numero_serie: "",
    existencia: "",
  });

  const fetchProductos = async () => {
    const encryptedToken = localStorage.getItem("token");
    const decryptedToken = decryptToken(encryptedToken);
    const headers = {
      "x-auth-token": decryptedToken,
    };

    llamadaApi(servidores, 0, { method: 'get', url: '/api/productos', headers }, (data) => {
      const { listaProductos } = data;
      if (Array.isArray(listaProductos)) {
        setProductos(listaProductos);
        console.log(listaProductos);
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

  // Obtener los nombres de las categorias
  const [categorias, setCategorias] = useState([]);

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

  // Obtener los nombres de las marcas
  const [marcas, setMarcas] = useState([]);

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

  // Obtener los nombres de los proveedores
  const [proveedores, setProveedores] = useState([]);

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
      id_producto: id,
    };

    llamadaApi(servidores, 0, { method: 'delete', url: `/api/productos/${id}`, headers }, () => {
      fetchProductos();
    }, (error) => {
      console.error("Error al eliminar el producto:", error);
    });
  };

  const handleUpdate = (producto) => {
    setCurrentProduct(producto);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentProduct({
      id_producto: "",
      descripcion: "",
      nombre_categoria: "",
      nombre_marca: "",
      nombre_proveedor: "",
      precio_compra: "",
      precio_venta: "",
      numero_serie: "",
      existencia: "",
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
    const url = isEditing ? `/api/productos/${currentProduct.id_producto}` : '/api/productos';

    llamadaApi(servidores, 0, { method, url, data: currentProduct, headers }, () => {
      fetchProductos();
      setShowModal(false);
    }, (error) => {
      if (error.response && error.response.data) {
        console.error("Error al guardar el producto:", error.response.data);
      } else {
        console.error("Error al guardar el producto:", error);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value,
    });
  };

  return (
    <div className="d-flex align-items-center justify-content-center mt-3 flex-column">
      <p className="fs-4" style={{ color: "#843C0C" }}>
        Gestión de Productos
      </p>
      <Button className="mb-3 btn btn-success" onClick={handleAdd}>
        Agregar un producto
      </Button>
      <div className="card" style={{ maxHeight: "75vh", overflowY: "scroll" }}>
        <table className="table">
          <thead>
            <tr>
              <th className="d-none">#</th>
              <th>DESCRIPCIÓN</th>
              <th>CATEGORÍA</th>
              <th>MARCA</th>
              <th>PROVEEDOR</th>
              <th>PRECIO COMPRA</th>
              <th>PRECIO VENTA</th>
              <th>NUM. SERIE</th>
              <th>EXISTENCIA</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                <td className="d-none">{producto.id_producto}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.nombre_categoria}</td>
                <td>{producto.nombre_marca}</td>
                <td>{producto.nombre_proveedor}</td>
                <td>{producto.precio_compra}</td>
                <td>{producto.precio_venta}</td>
                <td>{producto.numero_serie}</td>
                <td>{producto.existencia}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(producto.id_producto)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleUpdate(producto)}
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
            {isEditing ? "Actualizar Producto" : "Agregar Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={currentProduct.descripcion}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="nombre_categoria"
                value={currentProduct.nombre_categoria}
                className="form-control"
                onChange={handleChange}
              >
                <option>--Seleccione una categoría--</option>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria.nombre_categoria}>
                    {categoria.nombre_categoria}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Marca</Form.Label>
              <Form.Select
                name="nombre_marca"
                value={currentProduct.nombre_marca}
                className="form-control"
                onChange={handleChange}
              >
                <option>--Seleccione una marca--</option>
                {marcas.map((marca, index) => (
                  <option key={index} value={marca.nombre_marca}>
                    {marca.nombre_marca}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Proveedor</Form.Label>
              <Form.Select
                name="nombre_proveedor"
                value={currentProduct.nombre_proveedor}
                className="form-control"
                onChange={handleChange}
              >
                <option>--Seleccione un proveedor--</option>
                {proveedores.map((proveedor, index) => (
                  <option key={index} value={proveedor.nombre_proveedor}>
                    {proveedor.nombre_proveedor}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio de Compra</Form.Label>
              <Form.Control
                type="number"
                name="precio_compra"
                value={currentProduct.precio_compra}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio de Venta</Form.Label>
              <Form.Control
                type="number"
                name="precio_venta"
                value={currentProduct.precio_venta}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Número de Serie</Form.Label>
              <Form.Control
                type="text"
                name="numero_serie"
                value={currentProduct.numero_serie}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Existencia</Form.Label>
              <Form.Control
                type="number"
                name="existencia"
                value={currentProduct.existencia}
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

export default Productos;

