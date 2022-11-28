// represents a linesData entry
class Line {
	constructor(id, contents) {
		this.id = id;
		this.contents = contents;
	}
	included = true;
	relatedLineIDs = [];
}

let myObj = { problemType: null, exportMethod: null, linesData: [] };

function logJSON() {
	console.log('loaded');
	// console.log(JSON.stringify(myObj));
}

// read file into array, initialize myObj, return array for display on annotation screen
async function uploadFile() {
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
		myObj.linesData.push(l);
	}
	console.log('Contents\n' + JSON.stringify(myObj));
}

// changes included status of lineID
function toggleIncluded(lineID) {
	if (myObj.linesData[lineID].included) {
		myObj.linesData[lineID].included = false;
	} else {
		myObj.linesData[lineID].included = true;
	}
}

// Adds two lines to each other's relatedLines arrays
function addRelatedLines(ID1, ID2) {
	myObj.linesData[ID1].relatedLineIDs.push(ID2);
	myObj.linesData[ID2].relatedLineIDs.push(ID1);
}

// removes all entries from myObj where contents == "". Sets new lineIDs and clears the relatedLines array.
// may be a helpful option for users
function cleanEmptyContents() {
	let tempObj = { problemType: null, exportMethod: null, linesData: [] };
	const len = myObj.linesData.length;
	console.log(len);
	let numRemoved = 0;
	let numPushed = 0;
	tempObj.problemType = myObj.problemType;
	tempObj.exportMethod = myObj.exportMethod;

	for (let i = 0; i < len; i++) {
		if (myObj.linesData[i].contents == '') {
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

function save() {
	// save the library to local storage
	localStorage.setItem('lines', JSON.stringify(myObj));
}

let theObj = localStorage.getItem('lines');
if (theObj) {
	myObj = theObj;
}

// parseLines("./example.txt");
// toggleIncluded(2);
// addRelatedLines(2, 6);
// cleanEmptyContents();
// console.log(JSON.stringify(myObj));
