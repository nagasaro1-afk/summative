import { loadSettings, saveRecords, saveSettings } from "./storage.js";

export const defaultSettings = {
    categories: ["Food", "Books", "Transport", "Entertainment", "Fees", "Other"],
    rates: {USD: 1, EUR: 0.92, RWF: 1450},
    displayCurrency: "USD",
    cap: 2000
};

export const state = {
    records: [],
    settings:JSON.parse(JSON.stringify(defaultSettings )),
    editingId: null
};

export function startState(records) {
    state.records = records;
    const saved = loadSettings();
    if(saved) {
        state.settings = Object.assign({}, defaultSettings, saved);
    }
    saveRecords(state.records);
    }

    function makeId() {
        let biggest = 0;
        for(const r of state.records) {
            const num = parseInt(r.id.replace("txn_", ""),10);
            if (num > biggest) {
                biggest = num;
            }
        }
        return "txn_" + String(biggest +1).padStart(4, "0");
    }


    export function addRecord(values){
        const now = new Date().toISOString();
        const record = {
            id: makeId(),
            description: values.description,
            amount: parseFloat(values.amount),
            category: values.category,
            date: values.date,
            createdAt: now,
            updatedAt: now
        };
        state.records.push(record);
        saveRecords(state.records);
    }

    export function updateRecord(id, values) {
        for (const r of state.records) {
            if (r.id === id) {
                r.description = values.description;
                r.amount = parseFloat(values.amount);
                r.category = values.category;
                r.date = values.date;
                r.updatedAt = new Date().toISOString();
            }
        }
        saveRecords(state.records);
    }
 

    export function deleteRecord(id) {
        state.records = state.records.filter(function (r){ 
    return r.id !== id;
        });
        saveRecords(state.records);
    }

    export function replaceRecords(list) { 
        state.records = list;
        saveRecords(state.records);
    }

    export function updateSettings(newSettings) {
        state.settings = newSettings;
        saveSettings(state.settings);
    }

