// arreglo nombre monedas
const nombresMonedas = {
  dolar: "Dólar",
  dolar_intercambio: "Dólar intercambio",
  euro: "Euro",
  bitcoin: "Bitcoin",
  uf: "UF",
  utm: "UTM",
  ivp: "IVP",
  ipc: "IPC",
  imacec: "IMACEC",
  libra_cobre: "Libra cobre",
  tasa_desempleo: "Tasa desempleo",
  tpm: "TPM",
};

async function convertir() {
  const selector = document.querySelector("#moneda");
  const monedaSeleccionada = selector.value;

  if (monedaSeleccionada === "Seleccione moneda") {
    alert("Debes seleccionar una moneda");
    return;
  }

  try {
    const res = await fetch(`https://mindicador.cl/api/${monedaSeleccionada}`);
    const data = await res.json();

    // Obtengo cifras tipo number
    const pesosCLP = Number(document.querySelector("#clp").value);
    const valorMoneda = Number(data.serie[0].valor);

    const conversion = (pesosCLP * valorMoneda).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });

    // utilizo arreglo nombre monedas (nombresMonedas)
    const nombreMonedaMostrar =
      nombresMonedas[monedaSeleccionada] || monedaSeleccionada;

    const resultado = document.querySelector("#resultado");
    resultado.innerHTML = `Resultado: ${nombreMonedaMostrar.toUpperCase()} ${conversion}`;

    graficarMoneda(monedaSeleccionada);
  } catch (error) {
    alert(error.message);
  }
}

let miGrafico;

async function graficarMoneda(monedaSeleccionada) {
  try {
    const res = await fetch(`https://mindicador.cl/api/${monedaSeleccionada}`);
    const data = await res.json();

    const valoresX = [];
    const valoresY = [];

    const fechaActual = new Date();

    for (let i = data.serie.length - 1; i >= 0; i--) {
      const fechaDato = new Date(data.serie[i].fecha);

      const fechaHaceUnAno = new Date(fechaActual);
      fechaHaceUnAno.setFullYear(fechaActual.getFullYear() - 1);

      if (fechaDato >= fechaHaceUnAno && fechaDato <= fechaActual) {
        valoresX.push(data.serie[i].fecha.substring(0, 10));
        valoresY.push(data.serie[i].valor);
      }
    }

    const plugin = {
      id: "fondoCanvas",
      beforeDraw: (grafico, args, opciones) => {
        const { ctx } = grafico;
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = opciones.color || "#99ffff";
        ctx.fillRect(0, 0, grafico.width, grafico.height);
        ctx.restore();
      },
    };

    if (miGrafico) {
      miGrafico.destroy();
    }

    const nombreMonedaMostrar =
      nombresMonedas[monedaSeleccionada] || monedaSeleccionada;

    miGrafico = new Chart("graficoResultado", {
      type: "line",
      data: {
        labels: valoresX,
        datasets: [
          {
            label: "Valores de " + nombreMonedaMostrar.toUpperCase(),
            backgroundColor: "darkcyan",
            borderColor: "darkcyan",
            data: valoresY,
            id: nombreMonedaMostrar,
          },
        ],
      },
      options: {
        plugins: {
          fondoCanvas: {
            color: "white",
          },
        },
      },
      plugins: [plugin],
    });
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const btnBuscar = document.getElementById("btnBuscar");
  btnBuscar.addEventListener("click", convertir);
});
