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

// Adds ID2 to the relatedLines array of ID1 and all other arrays included in ID1
// Then updates ID2's relatedArray 
function addRelatedLines(ID1, ID2) {
	let l = myObj.linesData[ID1].relatedLines.length; // length of related lines array
	for (let i = 0; i < l; i++) {
		let curID = myObj.linesData[ID1].relatedLines[i];
		// if lineID not already in array, push
		if (myObj.linesData[curID].relatedLineIDs.indexOf(ID2) == -1) { 
			myObj.linesData[curID].relatedLineIDs.push(ID2);
		}
	}
	// add ID2 to ID1's array then copy into ID2's array
	myObj.linesData[ID1].relatedLineIDs.push(ID2);
	myObj.linesData[ID2].relatedLineIDs = myObj.linesData[ID1].relatedLineIDs;
	// replace ID of ID2 in ID2's array with the ID of ID1
	let ownIndex = myObj.linesData[ID2].relatedLines.indexOf(ID2);
	myObj.linesData[ID2].relatedLines[ownIndex] = ID1;
}

function addRelatedLinesV2(ID1, ID2) {
	let a1 = myObj.linesData[ID1].relatedLines;
	let a2 = myObj.linesData[ID2].relatedLines;
	let arr = [...a1, ...a2];  // combined arrays
	let l = arr.length;
	for(let i=0;i<l;i++){
		let curID = arr[i];
		let ind = 
		if(ind != -1){

		}
	}

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
function resetSelections() {
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
// This function traces back to the file annotations design element
// specifically, adding buttons for each of the lines in the file
function addAnnotationLines() {
	let displayArea = document.getElementById('displayContents');
	for (let i = 0; i < myObj.linesData.length; i++) {
		let button = document.createElement('button');
		button.setAttribute('id', 'lineButton-' + i.toString());
        button.classList.add('lineButton');
		button.innerHTML = myObj.linesData[i].contents;
		displayArea.appendChild(button);
	}
}

// parseLines("./example.txt");
// toggleIncluded(2);
// addRelatedLines(2, 6);
// cleanEmptyContents();
// console.log(JSON.stringify(myObj));
