import { state } from "./state.js";
import { highlight, escapeHtml } from "./search.js";

const tableBody = document.querySelector("#records-body");
const statusBox = document.querySelector("#status");

export function showStatus(message) {
    statusBox.textContent = message;
}

function normalRow(rec, re) {
    const code = state.settings.displayCurrency;
    const converted = ( rec.amount * state.settings.rates[code]).toFixed(2);
    const id = escapeHtml(rec.id);
    const name = escapeHtml(rec.description);


return `
<td data-label="Date">${highlight(rec.date, re)}</td>
<td data-label="Description">${highlight(rec.description, re)}</td>
<td data-label="Category">${highlight(rec.category, re)}</td>
<td data-label="Amount (USD)">${highlight(rec.amount.toFixed(2), re)}</td>
<td data-label="Converted">${converted} ${code}</td>
<td data-label="Actions">
 <button class="edit-btn" data-id="${id}" aria-label="Edit ${name}">Edit</button>
 <button class="delete-btn" data-id="${id}" aria-label="Delete ${name}">Delete</button>

</td>`
}

function editRow(rec) {
const id = escapeHtml(rec.id);

return`
<td data-label="Date"><input type="text" id="edit-date" aria-label="Date" value="${escapeHtml(rec.date)}"></td>
<td data-label="Description"><input type="text" id="edit-description" aria-label="Description" value="${escapeHtml(rec.description)}"></td>
<td data-label="Category"><input type="text" id="edit-category" list="category-list" aria-label="Category" value="${escapeHtml(rec.category)}"></td>
<td data-label="Amount (USD)"><input type="text" id="edit-amount" aria-label="Amount in USD" value="${escapeHtml(rec.amount)}"></td>
<td data-label="Converted">-</td>
<td data-label="Actions">
<button class="save-btn" data-id="${id}">Save</button>
<button class="cancel-btn" data-id="${id}">Cancel</button>
</td>`;
}


export function renderTable(list,re) {
    document.querySelector("#converted-head").textContent=
    "Converted (" + state.settings.displayCurrency + ")";

    tableBody.innerHTML = "";

    if (list.length ===0) {
tableBody.innerHTML = '<tr><td colspan="6">No records found.</td></tr>';
   return;      
    
}

for ( const rec of list) {
    const row = document.createElement("tr");
    if (rec.id === state.editingId) {
        row.innerHTML = editRow(rec, re);

    } else {
        row.innerHTML = normalRow(rec, re);

    }
    tableBody.appendChild(row);
}
}

function dateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() +1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
}


 export function renderStats() {
    const records = state.records;

    let total = 0;
    const categoryTotals = {};
    for (const r of records) {
        total += r.amount;
        categoryTotals[r.category]= (categoryTotals[r.category] || 0) + r.amount;
    }
    let topName = "-";
    let topAmount = 0;
    for (const name in categoryTotals) {
        if (categoryTotals[name] > topAmount) {
            topAmount = categoryTotals[name];
            topName = name;
        }
    }

    document.querySelector("#stat-count").textContent = records.length;
    document.querySelector("#stat-sum").textContent = total.toFixed(2);
    document.querySelector("#stat-top").textContent = topName;


    const cap = state.settings.cap;
    const left = cap - total;
    const polite = document.querySelector("#cap-polite");
    const alertBox = document.querySelector("#cap-alert");
    polite.textContent = "";
    alertBox.textContent = "";
 

 if (left >= 0) {
    polite.textContent = "You are under your cap. "  + left.toFixed(2) + " USD remaining.";
 }else{
    alertBox.textContent = "You are over your cap by " + Math.abs(left).toFixed(2) + " USD!";
 }

 const days =[];
 let biggest = 0;
 for (let i =6; i>=0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = dateKey(day);

    let dayTotal = 0;
    for (const r of records) {
        if (r.date === key) {
            dayTotal += r.amount;
    }
 }
 if (dayTotal > biggest) {
    biggest = dayTotal;
 }
 days.push({ label: key.slice(5), amount: dayTotal });
}

let html = "";
for (const d of days) {
    let height = 0;
    if (biggest > 0) {
        height = (d.amount / biggest) * 100;
    }
html += `<div class="trend-col">
<span>${d.amount.toFixed(0)}</span>
<div class= "bar" style="height: ${height}px"></div>
<span>${d.label}</span>
</div>`;
}
document.querySelector("#trend").innerHTML = html;
 }
