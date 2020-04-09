new Chart(document.getElementById("ganancias"), {
    type: 'line',
    data: {
        labels: ["Enero", "Febrero", "Marzo", "Abril"],
        datasets: [{
            data: [0, 100, 300, 250],
            label: "Euros",
            borderColor: "#3e95cd",
            fill: true
        }
        ]
    },
    options: {
        title: {
            display: true,
            text: 'Ganancias en los ultimos dias'
        }
    }
});

new Chart(document.getElementById("pedidos"), {
    type: 'line',
    data: {
        labels: ["Enero", "Febrero", "Marzo", "Abril"],
        datasets: [{
            data: [0, 2, 6, 5],
            label: "Nº pedidos",
            borderColor: "#3cba9f",
            fill: true
        }
        ]
    },
    options: {
        title: {
            display: true,
            text: 'Numeros de pedidos realizados'
        }
    }
});

new Chart(document.getElementById("pagos"), {
    type: 'pie',
    data: {
      labels: ["Paypal", "Targeta de Credito", "GPay", "otros"],
      datasets: [{
        label: "",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
        data: [2478,5267,734,784]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Ganancias por categorias',
      }
    }
});
