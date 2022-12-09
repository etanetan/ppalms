// represents a linesData entry
// TODO: update line to fit new JSON format
class Line {
	// constructor to set id and contents for line
	constructor(id, contents) {
		this.id = id;
		this.contents = contents;
		this.relatedLineIDs = [];
	}
	// line is included in output by default
	included = true;

	fillInTheBlank;
    multChoice;
};
// class to store fill in the blank questions
class fillInTheBlank {
	constructor(contents, missingItem) {
		this.contents = contents;
		this.missingItem = missingItem;
	}
};
// class to store multiple choice questions
class multChoice {
	constructor(prompt, a, b, c, d) {
		this.prompt = prompt;
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	}
};

// main object for holding the problem type, export method, and data
// on all of the lines in the source file
let myObj = {"exportMethod": null, "linesData": [] };
// copy object used for resetting the annotations on the lines
let copyObj = {"exportMethod": null, "linesData": [] };

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

	let name = fileData.name;
	let go = false;
	let acceptableExtensions = ['.txt','.doc','.docx','.html','.css','.js','.java','.c','.cc','.cpp','.py','.xhtml','.php','.sql','.h','.swift','.sh','.vb','.md'];
	// check for unnaceptable extensions
	for(let i=0;i<acceptableExtensions.length;i++){
		if(name.includes(acceptableExtensions[i])){
			go = true;
		}
	}
	if(name.includes(".") && (!go)) {
		alert("Unnaceptable file extension selected");
		return;
	}

    let text = await fileData.text();
    fileSpace.innerText = text;
	let submitButton = document.getElementById("submitButton");
	submitButton.disabled = false; //setting button state to disabled
	console.log('File contents should now be on webpage');
	populateObject(text);
}
// helper function takes in a string and populates myObj with new Line elements from that string (newline deliminated)
function populateObject(text){
	myObj.linesData = [];  // clear linesData of myObj
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
// function includes all lineIDs in text value string
function includeLines() {
	let lineStr = document.getElementById("includeLines").value;
	let arr = strToIntArr(lineStr);
	let len = arr.length;
	let numEntries = myObj.linesData.length;
	for(var i=0;i<len;i++){
		let cur = arr[i];
		if(cur<numEntries && cur >= 0){
			myObj.linesData[cur].included = true;
		}
	}
	console.log(myObj);
}
// function excludes all lineIDs in text value string
function excludeLines() {
	let lineStr = document.getElementById("excludeLines").value;
	let arr = strToIntArr(lineStr);
	let len = arr.length;
	let numEntries = myObj.linesData.length;
	for(var i=0;i<len;i++){
		let cur = arr[i];
		if(cur<numEntries && cur >= 0){
			console.log("Excluding " + cur);
			myObj.linesData[cur].included = false;
		}
	}
	console.log(myObj);
}
// Adds the related lines user has entered into the relatedLines arrays of each respective element
// TODO: fix fact that arr[i] is undefined at times
function addRelatedLines() {
	let lineStr = document.getElementById("relatedLines").value;
	let arr = strToIntArr(lineStr);
	let len = arr.length;

	for (let i = 0; i < len; i++) {
		// current line id
		let cur = arr[i];
		if (cur >= myObj.linesData.length || cur < 0){
			continue;
		}
		// set array of current item to the new array
		myObj.linesData[cur].relatedLineIDs = arr.slice(0);

		// remove self's id from array:
		let ind = myObj.linesData[cur].relatedLineIDs.indexOf(cur);
		if (ind != -1) {
			// if self's ID is in array, remove
			myObj.linesData[i].relatedLineIDs.splice(ind, ind);
		}
	}
	console.log(arr);
}
// helper to turn comma seperated text box entries into array of integers
function strToIntArr(str){
	// make every element in array unique:
	let noWhiteSpace = str.replace(/\s+/g, '');
	let arrV1 = noWhiteSpace.split(",");
	let arrV2 = arrV1.filter(Number);
	var arrV3 = arrV2.filter(uniqueElements);
	var arr = [];
    let len = arrV3.length;

    for (var i = 0; i < len; i++){
		arr.push(parseInt(arrV3[i]));
	}
	return arr;
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
	let tempObj = {"exportMethod": null, "linesData": [] };
	const len = myObj.linesData.length;
	let numRemoved = 0;
	let numPushed = 0;
	tempObj.exportMethod = myObj.exportMethod;

	for (let i = 0; i < len; i++) {
		if (
			myObj.linesData[i].contents == '' ||
			myObj.linesData[i].contents.trim().length == 0
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
    // rerender the buttons to not include the empty spaces
    addAnnotationLines();
}
// resets object fields to what they were before annotating
// This function traces back to the file annotations design element
// specifically, resetting all annotations to the lines
function resetSelections(addAnnotations) {
	console.log(
		'Test Case: resetSelections (resets object contents to what they were before annotating)'
	);
	console.log('Object before resetting: ' + JSON.stringify(myObj));
	myObj = copyObj;
	console.log('Object after resetting: ' + JSON.stringify(myObj));
    // rerender the buttons
	if(addAnnotations){
    	addAnnotationLines();
	}
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
    while (displayArea.firstChild) {
        displayArea.removeChild(displayArea.firstChild);
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
		button.innerHTML = i.toString() + ") " + myObj.linesData[i].contents;
		// add the button to the correct area on the page
		displayArea.appendChild(button);
	}
}
function removeComments(){
	let tempObj = {"exportMethod": null, "linesData": [] };
	const len = myObj.linesData.length;
	let numRemoved = 0;
	let numPushed = 0;
	tempObj.exportMethod = myObj.exportMethod;
	let input = document.getElementById("fname").value;
	console.log("Input: " + input.length);
	// remove lines
	for(let i=0;i<len;i++){
		let trimmedLine = myObj.linesData[i].contents.trim();
		if(trimmedLine.substring(0, input.length) == input){
			console.log("Removed a line");
			numRemoved++;
		}
		else{
			tempObj.linesData.push(myObj.linesData[i]); // push old object
			tempObj.linesData[numPushed].relatedLineIDs = []; // clear relatedLineIDs
			tempObj.linesData[numPushed].id -= numRemoved; // reset lineID
			numPushed++;
		}
	}
	myObj = tempObj;
	console.log('Object after: \n' + JSON.stringify(myObj));
    // rerender the buttons to not include the removed lines
    addAnnotationLines();
}
// parseLines("./example.txt");
// toggleIncluded(2);
// addRelatedLines(2, 6);
// cleanEmptyContents();
// console.log(JSON.stringify(myObj));

function generateFillInTheBlank() {
	// loop through each line and generate a question for each line
	for (let i=0; i<myObj.linesData.length; i++) {
		// 
	}
}

function generateMultipleChoice() {
	// loop through each line and generate a question for each line
	for (let i=0; i<myObj.linesData.length; i++) {
		// 
	}
}

function generateTrueOrFalse() {
	// loop through each line and generate a question for each line
	for (let i=0; i<myObj.linesData.length; i++) {
		// 
	}
}

function setExportMethod(){
	myObj.exportMethod = document.getElementById("export").value;
	console.log("Export method: " + myObj.exportMethod);
}
