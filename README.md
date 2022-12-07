# ppalms

<h3>Click on the Live Demo below</h3>
<p>You will be brought to our login page. From there, you can upload a file, annotate it, then view it as a JSON.
The Login page is not functional but is our intention to connect a database to store login information for users.</p>

<a href="http://etanetan.github.io/ppalms/">Live Demo</a>

<h2>Unit Testing</h2>
Our testing is done by several console.log statements in JavaScript to test the output against the correct output based on an example file as input (example.py). 


JSON Object Data Format:
myObj = 
[“exportMethod”:””, “LinesData”: 
{“ID”:””, “LineContents”:””, “”Included”:bool, “FillInBlank”:[”Contents”:”(NOTE: Should have underscores instead of missing item”,”MissingItem”:””], “MultChoice”:[“Prompt”:””, “A”:””, “B”:””, “C”:””, “D”:””]},
 … ]
 
