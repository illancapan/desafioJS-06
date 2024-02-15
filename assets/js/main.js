document.getElementById('search-btn').addEventListener('click', function() {
    convert();
});

async function convert() {
    try {
        const clpAmount = document.getElementById('clp').value;
        const coin = document.getElementById('coin').value;

        const response = await fetch(`https://mindicador.cl/api/${coin}`);
        const data = await response.json();

        const exchangeRate = data.serie[0].valor;

        const result = clpAmount * exchangeRate;

        document.getElementById('result').innerHTML = `El monto en ${coin.toUpperCase()} es: ${result.toLocaleString()} ${coin.toUpperCase()}`;

        const ctx = document.getElementById('result-chart').getContext('2d');

        if (window.myChart instanceof Chart) {
            window.myChart.destroy();
        }

        const dataForChart = {
            labels: ['CLP', coin.toUpperCase()],
            datasets: [{
                label: 'Monto convertido',
                data: [
                    { x: 'CLP', y: parseFloat(clpAmount) },
                    { x: coin.toUpperCase(), y: parseFloat(result.toFixed(2)) }
                ],
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }]
        };

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: dataForChart,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Hubo un problema al procesar la solicitud:', error);
        document.getElementById('result').innerHTML = 'Hubo un problema al procesar la solicitud.';
    }
}


