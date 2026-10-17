export const rules = {
    description: /^\S(?:.*\S)?$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[a-Za-z]+(?:[ -][A-Za-z]+)*$/,
    duplicateWord: /\b(\w+)\s+\1\b/i,
    rate: /^\d+(\.\d+)?$/
};

export function validatefields(values){
    const errors ={ description: "", amount:"", category: "", date: "" };

if (!rules.description.test(values.description)){
    errors.description = "Description can't be empty or start/end with a space.";
}else if (rules.duplicateWord.test(values.description)) {
    errors.description = "Description has a repested word (like 'the the').Please fix it.";
}

if (!rules.amount.test(values.amount)) {
    errors.amount ="Amount must be like 12 or 12.50 (max 2 decimals).";
}
 if (!rules.category.test(values.category)){
    errors.category = "category can only have letters, spaces and hyphens.";
 }
 if (!rules.date.test(values.date)) {
    errors.date = "Date must look like 2026-10-12.";
 }

 return errors;

}

export function hasErrors(erors) {
    return errors.description !== "" || errors.amount !== "" ||
           errors.category !== "" || errors.date !== "";
}

export function isValidRecord(r) {
    if (typeof r !== "object" || r ===null) return false;
    if (typeof r.id !== "string" || r.id === "") return false;
    if (typeof r.description !== "string" || !r.description.test (r.description)) return false;
    if (typeof r.amount !== "number" || r.amount < 0) return false;
    if (typeof r.category !== "string" || !r.category.test (r.category)) return false;
    if (typeof r.date !== "string" || !r.date.test(r.date))return false;
    if (typeof r.createdAt !== "string") return false;
    if (typeof r.updatedAt !== "string") return false;
      return true;
}

export function isValidate(date){
    if(!Array.isArray(data)) return false;
    for (const r of data) {
        if(!isValidRecord(r)) return false;
    }
    return true;
}