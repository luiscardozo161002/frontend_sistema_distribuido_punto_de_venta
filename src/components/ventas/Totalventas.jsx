import { useState, useEffect } from "react";
import axios from "axios";
import { decryptToken } from "../../store/authSlice";

const baseURL = "http://localhost:3000/api/obtenertotalventas";

function Totalventas() {
    const [obtenerTotalVentas, setObtenerTotalVentas] = useState([]);
    const [pago, setPago] = useState(''); // Estado para el valor ingresado en el input
    const [cambio, setCambio] = useState(null); // Estado para el cambio calculado

    useEffect(() => {
        const encryptedToken = localStorage.getItem("token");
        const decryptedToken = decryptToken(encryptedToken);
        const headers = {
            "x-auth-token": decryptedToken,
        };

        axios
            .get(baseURL, { headers })
            .then((response) => {
                const { totalVenta } = response.data;
                if (Array.isArray(totalVenta) && totalVenta.length >= 2) {
                    setObtenerTotalVentas(totalVenta[0]);
                } else {
                    console.error("Estructuración de los datos incorrectos");
                }
            })
            .catch((error) => {
                console.error("Error obtención de datos:", error);
            });
    }, []);

    const handleInputChange = (event) => {
        setPago(event.target.value);
    };

    const handleCalculateChange = () => {
        if (obtenerTotalVentas.length > 0) {
            const total = obtenerTotalVentas[0]?.total || 0;
            const pagoIngresado = parseFloat(pago);
            const cambioCalculado = pagoIngresado - total;
            setCambio(cambioCalculado);
        }
    };

    return (
        <div className="card p-5 d-flex align-items-center">
            {obtenerTotalVentas.map((totalVenta, index) => (
                <div key={index}>
                    <h4 className="text-center mb-3">Total de Venta</h4>
                    <p><span>Total a pagar: </span><strong>${totalVenta.total}</strong></p>
                    <form action="">
                        <div className="input-group mb-2">
                            <span className="input-group-text" id="basic-addon1">$</span>
                            <input
                                type="text"
                                className="form-control"
                                size={22}
                                placeholder="Ingrese la cantidad del pago"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                value={pago}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button className="btn btn-success" type="button" onClick={handleCalculateChange}>Calcular Cambio</button>
                    </form>
                    {cambio !== null && (
                        <p className="mt-3">Cambio: <strong>${cambio}</strong></p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Totalventas;
