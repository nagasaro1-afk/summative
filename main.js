//The main file. It connects everything: it listens to the forms and buttons,
// and uses the other files (state, validators, search, ui, storage)


import { loadRecords } from "./storage.js";
import {
    state, startState, addRecord, updateRecord,
    deleteRecord, replaceRecords,updateSettings
}from "./state.js";
import { rules, validateFields, hasErrors, isValidData } from "./validators.js";
import { compileRegex, matchesRecord, sortList } from "./search.js";
import { renderTable, renderStats, showStatus } from "./ui.js";
 
// short way to write document.querySelector
const $ =(selector) => document.querySelector(selector);
   
 // -------helpers-----

 // Redraws the table and the dashboard (called after every change)

 function refresh() {
   // turn the search text into a regex
    const re = compileRegex($("#search").value, $("#ignore-case").checked);
    // if something was typed but the regex is broken
    const badPattern = $("#search").value !== "" && re === null;
$("#search-error").textContent = badPattern ? "That pattern is not a valid regex yet." : "";
// keep only the records that match the search, then sort them
const list = state.records.filter((rec) => matchesRecord(rec, re))
renderTable(sortList(list, $("#sort").value),re);
renderStats();
}
//vReads the 4 values from the add form or from the inline eedit row
// prefix is "#" for the add form and "#edit-" for the inline edit row
function readValues(prefix) {
    return{
        description: $(prefix + "description").value.replace(/\s{2,}/g, " "),
        amount: $(prefix + "amount").value.trim(),
        category: $(prefix + "category").value.trim(),
        date: $(prefix + "date").value.trim()
    };
}

// true if the text is a number bigger than 0
 function isRate(text) {
    return rules.rate.test(text) && Number(text) > 0;
 }
// Puts the saved settings into the settings form and the category suggestions
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
    e.preventDefault();// stop the page from reloading

    const values = readValues("#");
    const errors = validateFields(values);
    let firstBad = null;// the first field with an error


// show (or clear) the error message of every field
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

// everything is fine: save, clear the form and redraw
 addRecord(values);
 e.target.reset();
 refresh();
 showStatus("Record added.");
 $("#description").focus();
 });

 // --------search and sort -------
 // redraw the table every time one of these changes
 $("#search").addEventListener("input", refresh);
 $("#ignore-case").addEventListener("change", refresh);
 $("#sort").addEventListener("change", refresh);

 // -------edit and delete buttons-------
 // One listener on the whole table body. It checks which button was clicked.
 $("#records-body").addEventListener("click", function (e) {
    const id = e.target.dataset.id;// the record id stored on the button
    const button = e.target.classList;
    if(!id) return;// the click was not a button

    // Edit: turn this row into text boxes

    if (button.contains("edit-btn")) {
        state.editingId = id;
        refresh();
        $("#edit-description").focus();
    }
    // Cancel: go back to the normal row
     if (button.contains("cancel-btn")) {
        state.editingId = null;
        refresh();
     }
     // Save: check the new values, then update the record

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
      // Delete: ask first, then remove the record
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
const problems = []; // list of error messages

// check the cap and the two rates

if (!rules.amount.test(cap)) problems.push("Cap must be a number like 500 or 500.50.");
if (!isRate(eur)) problems.push("EUR rate must be a number bigger than 0.");
if (!isRate(rwf)) problems.push("Rwf rate must be a number bigger than 0.");


// split the categories at the commas, trim them and remove empty ones
const categories = $("#settings-categories").value.split(",").map((c) => c.trim()).filter((c) => c !== "");
for (const name of categories) {
   if (!rules.category.test(name)) problems.push("Category '" + name + "' can only have letters, spaces and hyphens.");
}
if (categories.length === 0) problems.push("Add at least one category.");
// show the problems (if any) and stop
$("#settings-error").textContent = problems.join(" ");
if (problems.length > 0) return;

// all good: save the new settings
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
// Export : make a JSON file of all records and download it
 $("#export-btn").addEventListener("click", function () { 
   const blob = new Blob([JSON.stringify(state.records, null, 2)], { type: "application/json" });
   const link = document.createElement("a");
   link.href = URL.createObjectURL(blob);
   link.download = "finance-records.json"; //the file name
   link.click();
   showStatus("Exported " + state.records.length + " records.");
 });
// Import: read the chosen file, check it, then replace the records
 $("#import-file").addEventListener("change", function (e) {
   const file = e.target.files[0];
   if (!file) return;

const reader = new FileReader();
reader.onload = function () {
   let data = null;
   try{
      data = JSON.parse(reader.result);
   } catch (err) { // not valid JSON, so data stays null
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

e.target.value = ""; // so the same file can be chosen again
};
reader.readAsText(file);
 });

// -----start the app ------
async function start() {
   let records = loadRecords();

   // first time opening: load the seed data from seed.json
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








 