// all the regex rules are in one place.
// The form (main.js) and the import check both use these same rules.

export const rules = {
    // description: no empty text, and no space at the start or the end
    description: /^\S(?:.*\S)?$/,
         // amount: o or a number with no loading zero, up to 2 decimals (12 or 12.50)
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
        // date: YYYY-MM-DD, month 01-12 and day 01-31
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
// category; letters only, words can be joined by one space or one hyphen
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    // advanced rule (back-reference): finds a word that is repeated, like "the the"
    duplicateWord: /\b(\w+)\s+\1\b/i,
    // rate: a plain number like 0.92 (used for the exchange rates in Settings)
    rate: /^\d+(\.\d+)?$/
};


// Checks the 4 fields of the add form.
// Return an object with one message per field. An empty message means the field is fine.
export function validateFields(values){
    const errors ={ description: "", amount:"", category: "", date: "" };

    // description: first the basic rule, then the repeated word rule
if (!rules.description.test(values.description)){
    errors.description = "Description can't be empty or start/end with a space.";
}else if (rules.duplicateWord.test(values.description)) {
    errors.description = "Description has a repeated word (like 'the the').Please fix it.";
}

// amount
if (!rules.amount.test(values.amount)) {
    errors.amount ="Amount must be like 12 or 12.50 (max 2 decimals).";
}

// category
 if (!rules.category.test(values.category)){
    errors.category = "Category can only have letters, spaces and hyphens.";
 }

 //date
 if (!rules.date.test(values.date)) {
    errors.date = "Date must look like 2026-10-12.";
 }

 return errors;

}
// Return true if at least one field has a error message
export function hasErrors(errors) {
    return errors.description !== "" || errors.amount !== "" ||
           errors.category !== "" || errors.date !== "";
}

// checks one record from an imported file
// Every field must exist and have the right type
export function isValidRecord(r) {
    if (typeof r !== "object" || r ===null) return false;
    if (typeof r.id !== "string" || r.id === "") return false;
    if (typeof r.description !== "string" || !rules.description.test (r.description)) return false;
    if (typeof r.amount !== "number" || r.amount < 0) return false;
    if (typeof r.category !== "string" || !rules.category.test (r.category)) return false;
    if (typeof r.date !== "string" || !rules.date.test(r.date))return false;
    if (typeof r.createdAt !== "string") return false;
    if (typeof r.updatedAt !== "string") return false;
      return true;
}
// Checks a whole imported file: it must be a list and every record must be valid
export function isValidData(data){
    if(!Array.isArray(data)) return false;
    for (const r of data) {
        if(!isValidRecord(r)) return false;
    }
    return true;
}