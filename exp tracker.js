document.getElementById("expense-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    let amount = parseFloat(document.getElementById("amount").value);
    if (!date || !category || isNaN(amount)) return;

    let expense = { id: Date.now(), date, category, amount };
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    addExpenseToTable(expense);
    updateSummary();
});

function addExpenseToTable(expense) {
    let row = document.createElement("tr");
    row.setAttribute("data-id", expense.id);
    row.innerHTML = `<td>${expense.date}</td><td>${expense.category}</td><td>${expense.amount}</td>
        <td><button onclick="removeExpense(${expense.id})" class="btn btn-danger">Delete</button></td>`;
    document.getElementById("expense-list").appendChild(row);
}

function removeExpense(id) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
}

function updateSummary() {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let monthlyTotal = 0, yearlyTotal = 0;
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;

    expenses.forEach(exp => {
        let expDate = new Date(exp.date);
        if (expDate.getFullYear() === currentYear) {
            yearlyTotal += exp.amount;
            if (expDate.getMonth() + 1 === currentMonth) {
                monthlyTotal += exp.amount;
            }
        }
    });

    document.getElementById("monthly-total").innerText = monthlyTotal;
    document.getElementById("yearly-total").innerText = yearlyTotal;
    updateChart(expenses);
}

function updateChart(expenses) {
    let categories = {};
    expenses.forEach(exp => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });

    let ctx = document.getElementById("expenseChart").getContext("2d");
    
    // Destroy existing chart if it exists
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#FF6384",
                    "#C9CBCF"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            family: 'Poppins',
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Expense Distribution by Category',
                    font: {
                        family: 'Poppins',
                        size: 16,
                        weight: '500'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            }
        }
    });
}

function loadExpenses() {
    document.getElementById("expense-list").innerHTML = "";
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.forEach(addExpenseToTable);
    updateSummary();
}

document.addEventListener("DOMContentLoaded", loadExpenses);