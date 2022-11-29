// represents a linesData entry
class Line {
	// constructor to set id and contents for line
	constructor(id, contents) {
		this.id = id;
		this.contents = contents;
	}
	// line is included in output by default
	included = true;
	// array to hold the lines that it can be grouped with
	relatedLineIDs = [];
}
// main object for holding the problem type, export method, and data
// on all of the lines in the source file
let myObj = { "problemType": null, "exportMethod": null, "linesData": [] };
// copy object used for resetting the annotations on the lines
let copyObj = { "problemType": null, "exportMethod": null, "linesData": [] };

function logJSON() {
	// log the json
	console.log(JSON.stringify(myObj));
}

// read file into array, initialize myObj, return array for display on annotation screen
// This function traces back to the file selection design element
// along with the scenario of a user selecting a file
async function uploadFile() {
	console.log('Test case: uploadFile');
	console.log('Object before upload: ' + JSON.stringify(myObj));
	console.log('CopyObject before upload: ' + JSON.stringify(myObj));

	let [FileHandle] = await window.showOpenFilePicker();
	let fileData = await FileHandle.getFile();
	let text = await fileData.text();
	let fileSpace = document.getElementById('fileSpace');
	fileSpace.innerHTML = text;
	console.log('File contents should now be on webpage');
	const arr1 = text.split(/\r?\n/);
	let arr2 = arr1.filter((a) => a != '');
	for (let i = 0; i < arr2.length; i++) {
		let l = new Line(i, arr2[i]); // create & add a line entry to myObj for each arr entry
		myObj.linesData.push(l);
	}
	// set the copy lines to be the lines at this point, with no annotations
	// so it can later be reset to this exact state if requested by the user
	copyObj = myObj;
	console.log('Object after upload: ' + JSON.stringify(myObj));
	console.log('CopyObject after upload: ' + JSON.stringify(myObj));
}

// changes included status of lineID
// This function traces back to the file annotations design element
// specifically, toggling which lines should be included in the final output
function toggleIncluded(lineID) {
	// if line is currently included, do not include it
	if (myObj.linesData[lineID].included) {
		myObj.linesData[lineID].included = false;
		// if line is currently not included, now include it
	} else {
		myObj.linesData[lineID].included = true;
	}
	console.log('Test case: toggleIncluded');
	console.log("Line's Inclusion status: " + myObj.linesData[lineID].included);
	console.log('For line ID: ' + lineID);
}

// Adds ID2 to the relatedLines array of ID1 and all other arrays included in ID1
// Then updates ID2's relatedArray
function addRelatedLines(ID1, ID2) {
	console.log(
		"Test case: addRelatedLines (groups two related lines together, combining & updating the relatedLines arrays of all elements in each other's respective relatedLines arrays)"
	);
	console.log(
		"ID1's relatedLines array before adding: " +
			myObj.linesData[ID1].relatedLines
	);
	console.log(
		"ID2's relatedLines array before adding: " +
			myObj.linesData[ID2].relatedLines
	);

	let a1 = myObj.linesData[ID1].relatedLines;
	let a2 = myObj.linesData[ID2].relatedLines;
	let temp = [...a1, ...a2]; // combined arrays
	// make every element in array unique:
	var arr = temp.filter(uniqueElements);
	let l = arr.length;
	console.log('Combined array (unique): ' + arr);

	for (let i = 0; i < l; i++) {
		// current line id
		cur = arr[i];
		// set array of current item to the combined array
		myObj.linesData[cur].relatedLineIDs = arr;
		// remove self's id from array:
		let ind = myObj.linesData[cur].relatedLineIDs.indexOf(cur);
		if (ind != -1) {
			// if self's ID is in array, remove
			myObj.linesData[i].relatedLineIDs.splice(ind, ind);
		}
		console.log('Line ID: ' + cur);
		console.log('RelatedLinesArray: ' + myObj.linesData[i].relatedLineIDs);
	}
	console.log(
		"ID1's relatedLines array after adding: " +
			myObj.linesData[ID1].relatedLines
	);
	console.log(
		"ID2's relatedLines array after adding: " +
			myObj.linesData[ID2].relatedLines
	);
}
// helper function for addRelatedLines to find duplicate array entries
function uniqueElements(value, index, self) {
	return self.indexOf(value) === index;
}
// removes all entries from myObj where contents == "". Sets new lineIDs and clears the relatedLines array.
// may be a helpful option for users
// This function traces back to the file annotations design element
// specifically, removing lines that only contain spaces in them
function cleanEmptyContents() {
	console.log(
		'Test: cleanEmptyContents (removes all linesData elements from myObj with contents that contain only spaces)'
	);
	console.log('Object before: \n' + JSON.stringify(myObj));
	let tempObj = { "problemType": null, "exportMethod": null, "linesData": [] };
	const len = myObj.linesData.length;
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
	console.log('Object after: \n' + JSON.stringify(myObj));
}
// resets object fields to what they were before annotating
// This function traces back to the file annotations design element
// specifically, resetting all annotations to the lines
function resetSelections() {
	console.log(
		'Test Case: resetSelections (resets object contents to what they were before annotating)'
	);
	console.log('Object before resetting: ' + JSON.stringify(myObj));
	myObj = copyObj;
	console.log('Object after resetting: ' + JSON.stringify(myObj));
    addAnnotationLines();
}

// This function traces back to the data storage design element
// data is stored locally
function save() {
	// store the main object lines to local storage
	localStorage.setItem('lines', JSON.stringify(myObj));
	// store a copy of the object to local storage
	localStorage.setItem('copyLines', JSON.stringify(copyObj));
	// TESTING: console log stored items
	console.log('Test Case: Saving to Local Storage');
	console.log('Output: ' + JSON.parse(localStorage.getItem('lines')));
}
// parse the json to find the main object lines in local storage
let theObj = JSON.parse(localStorage.getItem('lines'));
// parse the json to find the copy object lines in local storage
let theCopyObj = JSON.parse(localStorage.getItem('copyLines'));

// if the main object was in local storage, set the main object to
// be equal to what was found in storage
if (theObj) {
	myObj = theObj;
}
// if the copy object was in local storage, set the copy object to
// be equal to what was found in storage
if (theCopyObj) {
	copyObj = theCopyObj;
}
// This function traces back to the data storage design element
// data is cleared locally in this function
function clearLocalStorage() {
	// clear local storage
	localStorage.clear();
	console.log('Test Case: Clearing Local Storage');
	console.log('Expected output: ');
	console.log('Actual output: ');
	for (let i = 0; i < localStorage.length; i++) {
		console.log(JSON.stringify(localStorage.getItem(localStorage.key(i))));
	}
}
// This function traces back to the file annotations design element
// specifically, adding buttons for each of the lines in the file
function addAnnotationLines() {
    
	// grab the area to place the buttons
	let displayArea = document.getElementById('displayContents');
    for (let i = 0; i < displayArea.children.length; i++) {
        displayArea.removeChild(displayArea.children[i]);
    }
	// loop through the lines
	for (let i = 0; i < myObj.linesData.length; i++) {
		// create a button for each line
		let button = document.createElement('button');
		// add a unique line id
		button.setAttribute('id', 'lineButton-' + i.toString());
		// add a class to style the buttons
		button.classList.add('lineButton');
		// set the text to be the same as the line text
		button.innerHTML = myObj.linesData[i].contents;
		// add the button to the correct area on the page
		displayArea.appendChild(button);
	}
}

// parseLines("./example.txt");
// toggleIncluded(2);
// addRelatedLines(2, 6);
// cleanEmptyContents();
// console.log(JSON.stringify(myObj));
