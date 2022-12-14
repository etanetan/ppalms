# ppalms

<h1>Click on the Live Demo below</h1>
<h2>You will be brought to our login page. From there, you can upload a file, annotate it, then view it as a JSON.
The Login page is not functional but is our intention to connect a database to store login information for users.</h2>

<a href="http://etanetan.github.io/ppalms/">Live Demo</a>

<h2>To Run on your own Machine:</h2>
<p>Open index.html in browser, login, upload file, annotate file, select export destination -> JSON output for generated questions has now been created & displayed</p>

<br>

<h3>Unit Testing</h3>
Our testing is done by several console.log statements in JavaScript to test the output against the correct output based on an example file as input (example.py). 



JSON Object Data Format:<br>
<h3>myObj = [</h3>
“exportMethod”:””, <br>
“LinesData”: [{”Included”:bool, “ID”:int, “LineContents”:””, "relatedLineIDs":int[]}, ...] <br>
"questionBank":[ {"id":int, "type":"", "question":"", "options":[], "answer":""}, ...] <br>
]<br>
 
