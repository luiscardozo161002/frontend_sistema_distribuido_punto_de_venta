
import { useState, useEffect } from "react";
import axios from "axios";
import { decryptToken } from "../../store/authSlice";

const baseURL = "http://localhost:3000/api/recienagregados";

function ProductosRecienAgregados() {
    const [productosAgregadosRecientes, setProductosAgregadosRecientes] = useState([]);

    useEffect(() => {
      // Recuperar el token cifrado del localStorage
      const encryptedToken = localStorage.getItem("token");
      
      // Desencriptar el token utilizando la función decryptToken de authSlice.js
      const decryptedToken = decryptToken(encryptedToken);
      
      // Configurar el header con el token desencriptado
      const headers = {
        "x-auth-token": decryptedToken
      };
  
      //Verfica que el token se desencripte
      //console.log("TOKEN " + decryptedToken);
  
      axios
        .get(baseURL, { headers }) // Pasar el token en los headers
        .then((response) => {
          const { listaProductosRecientes } = response.data;
          console.log(response.data);
          if (Array.isArray(listaProductosRecientes) && listaProductosRecientes.length >= 2) {
            setProductosAgregadosRecientes(listaProductosRecientes[0]);
          } else {
            console.error("Estructuración de los datos incorrectos");
          }
        })
        .catch((error) => {
          console.error("Error obtención de datos:", error);
        });
    }, []);
  
    return (
          <div className="card col-sm-9 col-xl-auto">
            <div className="card-header">
              <h5 className="card-title">Productos Recien Agregados</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Productos</th>
                    <th>Agregados</th>
                  </tr>
                </thead>
                <tbody>
                  {productosAgregadosRecientes.map((productosAgregadosRecientes, index) => (
                    <tr key={index}>
                      <td>{productosAgregadosRecientes.id_producto}</td>
                      <td>{productosAgregadosRecientes.descripcion}</td>
                      <td>{productosAgregadosRecientes.existencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    );
}

export default ProductosRecienAgregados


