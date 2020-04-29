let getMonthlyReceipts = () => {
    return new Promise((resolve, reject) => {
        let date = new Date();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        if (month < 10) {
            month = `0${month}`;
        }
        let baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`
        $.ajax({
            url: `${baseUrl}/family-budget/rest/receipt/${month}/${year}`,
            method: 'GET',
            success: (resp) => {
                resolve(resp);
            },
            error: (err) => {
                reject(err);
            }
        });
    });
}

(() => {
    getMonthlyReceipts()
    .then(resp => {
        recurringExpenses = resp.filter(expense => {
            return (expense.type === 'LOAN' || expense.type === 'UTILITY' || expense.type === 'INSURANCE' || expense.type === 'SCHOOL_FEES');
        });
        miscExpenses = resp.filter(expense => {
            return (expense.type === 'FOOD' || expense.type === 'CLOTHING' || expense.type === 'MISC');
        });

        let recurringTableBody = document.getElementById('recuringTableBody');
        let miscTableBody = document.getElementById('miscTableBody');
        recurringExpenses.forEach(expense => {
            let row = document.createElement('tr');
            let company = document.createElement('td');
            let type = document.createElement('td');
            let description = document.createElement('td');
            let amount = document.createElement('td');
            let date = document.createElement('td');
            company.innerHTML = expense.company;
            type.innerHTML = expense.type;
            description.innerHTML = expense.description;
            amount.innerHTML = `$${expense.amount}`;
            date.innerHTML = expense.date;
            row.appendChild(type);
            row.appendChild(company);
            row.appendChild(description);
            row.appendChild(amount);
            row.appendChild(date);
            recurringTableBody.appendChild(row); 
        });
        miscExpenses.forEach(expense => {
            let row = document.createElement('tr');
            let company = document.createElement('td');
            let type = document.createElement('td');
            let description = document.createElement('td');
            let amount = document.createElement('td');
            let date = document.createElement('td');
            company.innerHTML = expense.company;
            type.innerHTML = expense.type;
            description.innerHTML = expense.description;
            amount.innerHTML = `$${expense.amount}`;
            date.innerHTML = expense.date;
            row.appendChild(type);
            row.appendChild(company);
            row.appendChild(description);
            row.appendChild(amount);
            row.appendChild(date);
            miscTableBody.appendChild(row); 
        });
        let date = new Date();
        let days = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        let barLabels = new Array(days);
        let barData = new Array(days);
        for (let i = 0; i < days; i++) {
            barLabels[i] = i + 1;
            barData[i] = 0;
        }
        resp.forEach(expense => {
            let splits = expense.date.split('-');
            let index = Number.parseInt(splits[2]);
            barData[index] += expense.amount;
        });
        //Bar Chart data
        let barctx = document.getElementById('barChart').getContext('2d');
        let barChart = new Chart(barctx, {
            type: 'line',
            data: {
                labels: barLabels, 
                datasets: [{
                    label: 'Expenses Per Day',
                    data: barData,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)'
                    ]
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        let piedata = [0,0,0,0,0,0,0,0];
        resp.forEach(expense => {
            if (expense.type == 'LOAN') {
                piedata[0] += expense.amount;
            } else if (expense.type == 'FOOD') {
                piedata[1] += expense.amount;
            } else if (expense.type == 'UTILITY') {
                piedata[2] += expense.amount;
            } else if (expense.type == 'CLOTHING') {
                piedata[3] += expense.amount;
            } else if (expense.type == 'MISC') {
                piedata[4] += expense.amount;
            } else if (expense.type == 'SCHOOL_FEES') {
                piedata[5] += expense.amount;
            } else if (expense.type == 'INSURANCE') {
                piedata[6] += expense.amount;
            } else if (expense.type == 'TRANSPORTATION') {
                piedata[7] += expense.amount;
            }
        })
        let piectx = document.getElementById('pieChart').getContext('2d');
        let myPieChart = new Chart(piectx, {
          type: 'pie',
          data: { 
            datasets: [{ 
              data: piedata,
              backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ]
            }], 
            labels: ['Loans', 'Food', 'Utilities', 'Clothing', 'Misc Purchases', 'School Fees', 'Insurance', 'Transportation']
          },
        });

    })
    .catch(err => {
        console.error(err);
    });
})();