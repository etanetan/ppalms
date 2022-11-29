// represents a linesData entry
class Line {
	constructor(id, contents) {
		this.id = id;
		this.contents = contents;
	}
	included = true;
	relatedLineIDs = [];
}

let myObj = { "problemType": null, "exportMethod": null, "linesData": [] };
let copyObj = { "problemType": null, "exportMethod": null, "linesData": [] };

function logJSON() {
	console.log(JSON.stringify(myObj));
}

// read file into array, initialize myObj, return array for display on annotation screen
// This function traces back to the file selection design element
// along with the scenario of a user selecting a file
async function uploadFile() {
	console.log(myObj);
	let [FileHandle] = await window.showOpenFilePicker();
	let fileData = await FileHandle.getFile();
	let text = await fileData.text();
	console.log('here is the text' + text);
	let fileSpace = document.getElementById('fileSpace');
	fileSpace.innerHTML = text;
	const arr1 = text.split(/\r?\n/);
	let arr2 = arr1.filter((a) => a != '');
	for (let i = 0; i < arr2.length; i++) {
		let l = new Line(i, arr2[i]); // create & add a line entry to myObj for each arr entry
		console.log('loading data');
		myObj.linesData.push(l);
	}
	console.log('Contents\n' + JSON.stringify(myObj));
    copyObj = myObj;
}

// changes included status of lineID
// This function traces back to the file annotations design element
// specifically, selecting which lines should be included in the final output
function toggleIncluded(lineID) {
	if (myObj.linesData[lineID].included) {
		myObj.linesData[lineID].included = false;
	} else {
		myObj.linesData[lineID].included = true;
	}
}

// Adds two lines to each other's relatedLines arrays
// This function traces back to the file annotations design element
// specifically, selecting which lines do not need to be in any specified order
function addRelatedLines(ID1, ID2) {
	myObj.linesData[ID1].relatedLineIDs.push(ID2);
	myObj.linesData[ID2].relatedLineIDs.push(ID1);
}

// removes all entries from myObj where contents == "". Sets new lineIDs and clears the relatedLines array.
// may be a helpful option for users
// This function traces back to the file annotations design element
// specifically, removing lines that only contain spaces in them
function cleanEmptyContents() {
	let tempObj = { problemType: null, exportMethod: null, linesData: [] };
	const len = myObj.linesData.length;
	console.log(len);
	let numRemoved = 0;
	let numPushed = 0;
	tempObj.problemType = myObj.problemType;
	tempObj.exportMethod = myObj.exportMethod;

	for (let i = 0; i < len; i++) {
		if (
			myObj.linesData[i].contents == '' ||
			myObj.linesData[i].contents.trim() === 0
		) {
			numRemoved++;
		} else {
			tempObj.linesData.push(myObj.linesData[i]); // push old object
			tempObj.linesData[numPushed].relatedLineIDs = []; // clear relatedLineIDs
			tempObj.linesData[numPushed].id -= numRemoved; // reset lineID
			numPushed++;
		}
	}
	myObj = tempObj;
}
// resets object fields to what they were before annotating
// This function traces back to the file annotations design element
// specifically, resetting all annotations to the lines
function resetSelection(){
    myObj = copyObj;
}

// This function traces back to the data storage design element
// data is stored locally
function save() {
	// save the library to local storage
	localStorage.setItem('lines', JSON.stringify(myObj));
    localStorage.setItem('copyLines', JSON.stringify(copyObj));
	alert('saved to local storage');
}

let theObj = JSON.parse(localStorage.getItem('lines'));

let theCopyObj = JSON.parse(localStorage.getItem('copyLines'));

console.log('retrieved item: ' + theObj);
if (theObj) {
	myObj = theObj;
}
if (theCopyObj) {
    copyObj = theCopyObj;
}
// This function traces back to the data storage design element
// data is cleared locally in this function
function clearLocalStorage() {
	console.log('cleared local storage');
	localStorage.clear();
}

// parseLines("./example.txt");
// toggleIncluded(2);
// addRelatedLines(2, 6);
// cleanEmptyContents();
// console.log(JSON.stringify(myObj));
