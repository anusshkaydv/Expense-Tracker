document.addEventListener("DOMContentLoaded", loadExpenses);

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("expense-name").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;

    if (!name || !amount || amount < 0) {
        alert("Please enter valid details!");
        return;
    }

    const expense = { id: Date.now(), name, amount, category };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    addExpenseToDOM(expense);
    updateTotal();
    form.reset();
});

function addExpenseToDOM(expense) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${expense.name}</td>
        <td>₹${expense.amount}</td>
        <td>${expense.category}</td>
        <td><button class="delete-btn" onclick="deleteExpense(${expense.id})">X</button></td>
    `;
    expenseList.appendChild(tr);
}

function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = total;
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    loadExpenses();
}

function loadExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach(addExpenseToDOM);
    updateTotal();
}
document.getElementById("download-csv").addEventListener("click", downloadCSV);

function downloadCSV() {
    if (expenses.length === 0) {
        alert("No expenses to download!");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Amount,Category\n"; // CSV Header

    expenses.forEach(expense => {
        csvContent += `${expense.name},${expense.amount},${expense.category}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
