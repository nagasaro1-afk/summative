import { loadRecords } from "./storage.js";
import {
    state, startState, addRecord, updateRecord,
    deleteRecord, replaceRecords,updateSettings
}from "./state.js";
import { rules, validateFields, hasErrors, isValidData } from "./validators.js";
import { compileRegex, matchesRecord, sortList } from "./search.js";
import { renderTable, renderStats, showStatus } from "./ui.js";
 const $ =(selector) => document.querySelector(selector);
   
 // -------helpers-----
 function refresh() {
    const re = compileRegex($("#search").value, $("#ignore-case").checked);
    const badPattern = $("#search").value !== "" && re === null;
$("#search-error").textContent = badPattern ? "That pattern is not a valid regex yet." : "";

const list = state.records.filter((rec) => matchesRecord(rec, re))
renderTable(sortList(list, $("#sort").value),re);
renderStats();
}

// prefix is "#" for the add form and "#edit-" for the inline edit row
function readValues(prefix) {
    return{
        description: $(prefix + "description").value.replace(/\s{2,}/g, " "),
        amount: $(prefix + "amount").value.trim(),
        category: $(prefix + "category").value.trim(),
        date: $(prefix + "date").value.trim()
    };
}
 function isRate(text) {
    return rules.rate.test(text) && Number(text) > 0;
 }

 function fillSettings() {
    const s = state.settings;
    $("#category-list").innerHTML = s.categories.map((c) => `<option value="${c}"></option>`).join("");
    $("#cap").value = s.cap;
    $("#rate-eur").value = s.rates.EUR;
    $("#rate-rwf").value = s.rates.RWF;
    $("#display-currency").value = s.displayCurrency;
    $("#settings-categories").value = s.categories.join(", ");
 }

 // --------add form -------
 $("#record-form").addEventListener("submit",function (e) {
    e.preventDefault();

    const values = readValues("#");
    const errors = validateFields(values);
    let firstBad = null;

    for (const name in errors) {
        $("#" + name + "-error").textContent = errors[name];
        $("#" + name).setAttribute("aria-invalid", errors[name]? "true" : "false");
        if (errors[name] && !firstBad) firstBad = $("#" + name);
    }

 

 if (hasErrors(errors)) {
    firstBad.focus();
    showStatus("Please fix the errors in the form.");
    return;
 }

 addRecord(values);
 e.target.reset();
 refresh();
 showStatus("Record added.");
 $("#description").focus();
 });

 // --------search and sort -------
 $("#search").addEventListener("input", refresh);
 $("#ignore-case").addEventListener("change", refresh);
 $("#sort").addEventListener("change", refresh);

 // -------edit and delete buttons-------
 $("#records-body").addEventListener("click", function (e) {
    const id = e.target.dataset.id;
    const button = e.target.classList;
    if(!id) return;

    if (button.contains("edit-btn")) {
        state.editingId = id;
        refresh();
        $("#edit-description").focus();
    }
     if (button.contains("cancel-btn")) {
        state.editingId = null;
        refresh();
     }

     if (button.contains("save-btn")) {
        const values = readValues("#edit-");
        const errors = validateFields(values);

        if (hasErrors(errors)) {
            showStatus("Could not save: " + (errors.description || errors.amount || errors.category || errors.date));
            return;
        }

        updateRecord(id, values);
        state.editingId = null;
        refresh();
        showStatus("Record updated.");
     }

     if (button.contains("delete-btn") && confirm("Are you sure you want to delete this record?")) {

        deleteRecord(id);
        refresh();
        showStatus("Record  deleted.");
     }
 });

// --------settings ---------
 $("#settings-form").addEventListener("submit", function (e) {
    e.preventDefault();


    const cap = $("#cap").value.trim();
    const eur = $("#rate-eur").value.trim();
const rwf = $("#rate-rwf").value.trim();
const problems = [];

if (!rules.amount.test(cap)) problems.push("Cap must be a number like 500 or 500.50.");
if (!isRate(eur)) problems.push("EUR rate must be a number bigger than 0.");
if (!isRate(rwf)) problems.push("Rwf rate must be a number bigger than 0.");

const categories = $("#settings-categories").value.split(",").map((c) => c.trim()).filter((c) => c !== "");
for (const name of categories) {
   if (!rules.category.test(name)) problems.push("Category '" + name + "' can only have letters, spaces and hyphens.");
}
if (categories.length === 0) problems.push("Add at least one category.");

$("#settings-error").textContent = problems.join(" ");
if (problems.length > 0) return;


updateSettings({
   categories: categories,
   rates: {USD: 1, EUR: Number(eur), RWF: Number(rwf) },
   displayCurrency: $("#display-currency").value,
   cap: Number(cap)
});
fillSettings();
refresh();
showStatus("Settings saved.");
 });

// ------export and import ------
 $("#export-btn").addEventListener("click", function () { 
   const blob = new Blob([JSON.stringify(state.records, null, 2)], { type: "application/json" });
   const link = document.createElement("a");
   link.href = URL.createObjectURL(blob);
   link.download = "finance-records.json";
   link.click();
   showStatus("Exported " + state.records.length + " records.");
 });

 $("#import-file").addEventListener("change", function (e) {
   const file = e.target.files[0];
   if (!file) return;

const reader = new FileReader();
reader.onload = function () {
   let data = null;
   try{
      data = JSON.parse(reader.result);
   } catch (err) {
                       // not json, data stays null

   }
   if (data === null) {
      showStatus("Import failed: that file is not valid JSON.");
   }else if (!isValidData(data)) {
      showStatus("Import failed: some records have the wrong structure.");
   }else {
      replaceRecords(data);
      refresh();
      showStatus("Imported " + data.length + " records.");
   }

e.target.value = "";
};
reader.readAsText(file);
 });

// -----start the app ------
async function start() {
   let records = loadRecords();

   // first time opening: load the seed data
   if (records === null) {
      try{
         records = await (await fetch("seed.json")).json();
      }catch (err) {
         records = [];
      }
   }

   startState(records);
   fillSettings();
   refresh();
}

start();

 






 