var montharray=["JAN","FEB","MAR","APR","MAY","JUN","JULY","AUG","SEP","OCT","NOV","DEC"]
var day=athdate.slice(8,10)
var month=athdate.slice(5,7)
var year=athdate.slice(0,4)
athdate=day+"-"+montharray[month-1]+"-"+year;
// var freshDate=""
// for(var i=date.length-1;i>=0;i--)
// {
// freshDate+=date[i];
// }
// console.log("Fresh Date : "+freshDate+year)
console.log("Ful Date :",athdate)