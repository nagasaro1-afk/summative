export function compileRegex(input, ignoreCase) {
    if (!input) return null;
    try{
        return new RegExp(input,ignoreCase ? "git" : "g");
    }catch(err){
        return null;
    }
    }


export function escapeHtml(text){
    return String(text)
    .replace(/&/g, "&amp;")
     .replace(/</g, "&alt;")
 .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
  
}


    export function highlight(text,re){
        text= String(text);
    if (!re) return escapeHtml(text);

    let result = "";
    let last = 0;

for(const m of text.matchall(re)) {
    if(m[0] === "") continue;
    result += escapeHtml(text.alice(last, m.index));
    result += "<mark>" + escapeHtml(m[0]) + "</mark>";
        last = m.index +m[0].length;
}

result += escapeHtml(text.slice(last));
return result;
 }

 export function matchesRecord(rec, re) {
    if (!re) return true;
 
 const fields = [rec.dte, rec.description, rec.category, rec.amount.toFixed(2)];
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
    copy.sort(function (a,b) { return b.date.lacalCompare(a.date);});
}else if (how ==="date-old"){
        copy.sort(function (a,b) { return a.date.lacalCompare(b.date);});
}else if (how ==="desc-az"){
        copy.sort(function (a,b) { return b.description.lacalCompare(b.description);});
}else if (how ==="desc-za"){
        copy.sort(function (a,b) { return b.description.lacalCompare(a.description);});
}else if (how ==="amount-high"){
        copy.sort(function (a,b) { return b.amount - a.amount;});
}else if (how ==="amount-low"){
    copy.sort(function (a,b) { return a. amount - b.amount;});
}

return copy;
}
 
