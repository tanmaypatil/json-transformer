# Json transformer in visual way 

## Objective 
To develop a json transformer in beautiful/visual way .

## transformer application 
Will display a classic 2 pane .
Left pane will show the input json structure .
Right pane will show the output structure .
User is expected to map input structure to output struture .
Input can be Json of arbitary depth 

### Initial state
Transformation starts with input and output structure being same .
Input is immutable . Output can be changed.
Every field has to be mapped , else it will not come in output.
User will import a json file . This will be used for structure of input json .
Values in input json can be ignored.

### mapping  
User selects one field from input and another one from output and maps them .
In this case value should get mapped.
Should be able add simple function on the top of mapping . 
Few example functions 
* UPPERCASE  - converts value to uppercase
* TRIM  - Trims spaces from the field.

### structure change 
User can create a child node by selecting one of the existing node at output json.
Initially newly created node will have a dummy name . User needs to change the name .

### Operation save 
At the end , user should be able to save the transformation .
The input nodes which are not mapped will not be copied to output.
Transformation should be saved against a name .
Currently transformation metadata can be saved in file system itself .
Later it can be saved in a database.

### Operation test 
User should be able 
 * import json 
 * used a saved transformation 
 * and test the transformation . Output json should be displayed.

## User experience 
Special focus on user experience needs to be given .
Nodes which are mapped and which are not mapped should be easy to identify .
Mapping between input and output also should be easy to do with simple UI operation like click , press key or key combinations.

## tech stack 
User interface : React 
Backend of the tool : Python 
Generated code for transformation : need help in deciding.