import ProductosMasVendidos from "./ProductosMasVendidos";
import ProductosRecienAgregados from "./ProductosRecienAgregados";
import ProductoMenosVendidos from "./ProductoMenosVendidos";
import Acercade from "./Acercade";

function Inicio() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <section className="d-flex justify-content-center flex-wrap">
        <Acercade/>
      </section>
      <section className="d-flex justify-content-center align-items-center flex-row flex-wrap gap-2">
        <ProductosMasVendidos/>
        <ProductoMenosVendidos/>
        <ProductosRecienAgregados/>
      </section>
    </div>
  );
}

export default Inicio;
