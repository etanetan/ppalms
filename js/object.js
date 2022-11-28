// const myObj = {
//     "problemType":"Parson's", 
//     "exportMethod":"Canvas", 
//     "linesData":[
//     {"id":0, "included":true, "contents": "a sailor", "relatedLineIDs":[1, 4, 7]},
//     {"id":1, "included":true, "contents": "went to", "relatedLineIDs":[0, 4]}
//     ]};
const myObj = {"problemType": null, "exportMethod": null, "linesData":[]}; // alter this as user makes selections


/* How to append to linesData:

var myObj = '{"theTeam":[{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"3","status":"member"}]}';
var obj = JSON.parse(jsonStr);
obj['theTeam'].push({"teamId":"4","status":"pending"});
jsonStr = JSON.stringify(obj);

*/