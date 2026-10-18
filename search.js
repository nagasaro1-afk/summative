
// turns the text the user typed into a regex, returns null if it is broken

export function compileRegex(input, ignoreCase) {
    if (!input) return null;
    try{
        return new RegExp(input,ignoreCase ? "gi" : "g");
    }catch(err){
        return null;
    }
    }

// so that text can't mess up the page
export function escapeHtml(text){
    return String(text)
    .replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
  
}

// wraps the matches in <mark>
    export function highlight(text,re){
        text= String(text);
    if (!re) return escapeHtml(text);

    let result = "";
    let last = 0;

for(const m of text.matchAll(re)) {
    if(m[0] === "") continue;
    result += escapeHtml(text.slice(last, m.index));
    result += "<mark>" + escapeHtml(m[0]) + "</mark>";
        last = m.index +m[0].length;
}

result += escapeHtml(text.slice(last));
return result;
 }

 export function matchesRecord(rec, re) {
    if (!re) return true;
 
 const fields = [rec.date, rec.description, rec.category, rec.amount.toFixed(2)];
 for (const field of fields) {
    if (field.search(re) !== -1) {
        return true;
    }
 }
 return false;
} 

export function sortList(list,how){
const copy = list.slice();


if (how === "date-new") {
    copy.sort(function (a,b) { return b.date.localeCompare(a.date);});
}else if (how ==="date-old"){
        copy.sort(function (a,b) { return a.date.localeCompare(b.date);});
}else if (how ==="desc-az"){
        copy.sort(function (a,b) { return a.description.localeCompare(b.description);});
}else if (how ==="desc-za"){
        copy.sort(function (a,b) { return b.description.localeCompare(a.description);});
}else if (how ==="amount-high"){
        copy.sort(function (a,b) { return b.amount - a.amount;});
}else if (how ==="amount-low"){
    copy.sort(function (a,b) { return a. amount - b.amount;});
}

return copy;
}
 
