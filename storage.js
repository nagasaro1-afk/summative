const RECORDS_KEY = "fintracker:records";
const SETTINGS_KEY ="fintracker:settings";

export function loadRecords(){
    try{
        const data = JSON.parse(localStorage.getItem(RECORDS_KEY));
        if (Array.isArray(data)) {
            return data;
        }
        return null;
    }catch (err) {
        return null;
    }

}


export function loadSettings() {
    try{
        return JSON.parse(localStorage.getItem(SETTING_KEY));
    }catch(err){
        return null;
    }
}

export function saveSettings(settings){
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}