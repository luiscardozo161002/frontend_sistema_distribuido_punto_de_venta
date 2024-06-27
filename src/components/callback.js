const llamadaApi = async (Url_servers, index, onSuccess) => {
    try {
        const response = await fetch(Url_servers[index], { timeout: 5000 });
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const datosRecibidos = await response.json();
        onSuccess(datosRecibidos);
    } catch (error) {
        if (index < Url_servers.length - 1) {
            llamadaApi(Url_servers, index + 1, onSuccess);
        } else {
            console.error("Todos los servidores son inaccesibles");
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const servidores = [
        "http://172.168.2.44:3000",
        "http://172.168.0.35:3000",
        "http://172.168.3.242:3000",
        "http://172.168.3.90:3000",
    ];

    llamadaApi(servidores, 0, (datosRecibidos) => {
        console.log(datosRecibidos.mensaje);
    });
});
