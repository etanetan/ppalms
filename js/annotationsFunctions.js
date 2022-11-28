var myObj = {"problemType": null, "exportMethod": null, "linesData":[]};


const {readFileSync} = require('fs');

// read file into array, initialize myObj, return array for display on annotation screen
function parseLines(filename) {
  const contents = readFileSync(filename, 'utf-8');  // read all contents of file
  const arr = contents.split(/\r?\n/);  // split by newlines
  for (var i = 0; i < arr.length; i++) { 
    var l = new Line(i, arr[i]); // create & add a line entry to myObj for each arr entry
    myObj.linesData.push(l);
  }
  console.log(JSON.stringify(myObj));
  return arr;
}

// changes included status of lineID
function toggleIncluded(lineID){
    if(myObj.linesData[lineID].included){
        myObj.linesData[lineID].included = false;
    }
    else{
        myObj.linesData[lineID].included = true;
    }
}

// adds to lineNo to lineID's related line array
function addRelatedLines(lineID, lineNo){ 
    myObj.linesData[lineID].relatedLineIDs.push(lineNo);
}

// removes all entries from myObj where contents == "". Sets new lineIDs and clears the relatedLines array.
function cleanEmptyContents(){
    var tempObj = {"problemType": null, "exportMethod": null, "linesData":[]};
    const len = myObj.linesData.length;
    console.log(len);
    var numRemoved = 0;
    var numPushed = 0;
    tempObj.problemType = myObj.problemType;
    tempObj.exportMethod = myObj.exportMethod;

    for(var i = 0; i < len; i++){
        if(myObj.linesData[i].contents == ""){
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
}

// represents a linesData entry
class Line {
  constructor(id, contents) {
    this.id = id;
    this.contents = contents;
  }
  included = true;
  relatedLineIDs = [];
}


// parseLines("./example.txt");
// toggleIncluded(2);
// addRelatedLines(2, 6);
// cleanEmptyContents();
// console.log(JSON.stringify(myObj));

