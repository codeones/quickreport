 // to convert a XLSX FILE IN TO JSON FILE 
 var xlsxj = require("xlsx-to-json");
xlsxj({
  input: "simple.xlsx", 
  output: "output.json"
}, function(err, result) {
  if(err) {
    console.error(err);
  }else {
    console.log(result);
  }
});