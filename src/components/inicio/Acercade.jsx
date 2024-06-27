function Acercade() {
  return (
    <div className="col-md-9 d-flex flex-column p-4 mt-3">
      <div className="d-flex align-items-center mb-2 me-2">
        <img
          src="https://i.ibb.co/9vybH9Y/logo-ferreteria.png"
          alt="Logo de Ferrexpress"
          style={{ width: "70px" }}
          className="me-2"
        />
        <h3 className="fs-1">Sistema Ferrexpress</h3>
      </div>
      <div className="d-flex flex-row flex-wrap">
        <div className="d-flex flex-column col-md-8 me-3">
          <p className="fs-3">¡Bienvenido! administrador</p>
          <p className="text-justify fs-5">
            Estamos comprometidos con el cliente. Ofrecemos la mejor calidad en
            herramienta para de trabajo para el hogar y trabajo. Nuestro objetivo es reflejarnos
            en ser tu prioridad y no una opción más.
          </p>
        </div>
        <div>
          <img src="https://i.ibb.co/CpyLFg0/ferreteria4-800x630-removebg-preview.png" alt="Logo de carretilla con herramienta" style={{width:"150px", objectFit:"cover"}}/>
        </div>
      </div>
    </div>
  );
}

export default Acercade;
