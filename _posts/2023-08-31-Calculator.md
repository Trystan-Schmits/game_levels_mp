---
comments: False
layout: post
title: Calculator
description: A basic calculator I made
type: ccc
courses: {'csse': {'week': 2}}
categories: ['C4.1']
---
<style>
    .back {
      border: 1px outset black;
      border-radius : 5px;
      background-color: silver;
      text-align: center;
      margin-bottom: 10px;
    }
    .button {
      border: 1px outset black;
      border-radius : 5px;
      background-color: grey;
      text-align: center;
      width : 20%;
      height : 20%
    }
    .button2 {
      border: 1px outset black;
      border-radius : 5px;
      background-color: #989898;
      text-align: center;
      width : 20%;
      height : 20%
    }
    .button3 {
      border: 1px outset black;
      border-radius : 5px;
      background-color: lightgrey;
      text-align: center;
      width : 20%;
      height : 20%
    }
    .button4 {
      border: 1px outset black;
      border-radius : 5px;
      background-color: dimgrey;
      text-align: center;
      width : 20%;
      height : 20%
    }
    .output {
      border: 1px outset black;
      border-radius : 5px;
      background-color: white;
      color : black;
      width : 100%;
      height : 20%;
    }
    .dictionary {
        border: 1px outset black;
        color: black;
        background-color: silver;
        text-align: center;
        margin-bottom: 10px;
    }
    .avr{
        border: 1px outset black;
        color: black;
        background-color: lightgrey;
        text-align: center;
    }
    th{
        border: 1px outset black;
        color: black;
        background-color: silver;
        text-align: center;
    }
    td {
        border: 1px outset black;
        width: 50%;
        color: black;
        background-color: white;
        text-align: center;
    }
</style>
<div class="back" width="300" height="800">
    <p>
        <button onclick="run(7)" class="button"> 7  </button>
        <button onclick="run(8)" class="button"> 8  </button>
        <button onclick="run(9)" class="button"> 9  </button>
        <button onclick="modif(1)" class="button2"> + </button> 
    </p>
    <p>
        <button onclick="run(4)" class="button"> 4  </button>
        <button onclick="run(5)" class="button"> 5  </button>
        <button onclick="run(6)" class="button"> 6  </button>
        <button onclick="modif(2)" class="button2"> - </button>
    </p>
    <p>
        <button onclick="run(1)" class="button"> 1  </button>
        <button onclick="run(2)" class="button"> 2  </button>
        <button onclick="run(3)" class="button"> 3  </button>
        <button onclick="modif(3)" class="button2"> x </button>
    </p>
    <p> 
        <button onclick="note()" class="button3"> note  </button> 
        <button onclick="run(0)" class="button"> 0  </button>
        <button onclick="modif(5)" class="button2"> % </button>
        <button onclick="modif(4)" class="button2"> ÷ </button>
    </p>
    <p>
        <button onclick="equal()" class="button4"> = </button>
    </p>
    <p id="text" class="output">0</p>
</div>

<table class="dictionary">
    <tr id="dict">
        <th> Number </th>
        <th> Notes </th>
    </tr>
    <tr>
        <td class="avr" id="avr"> avr </td>
        <td class="avr"> Avarage </td>
    </tr>
</table>

<script> 
    let state = 0;
    let runningTotal = 0;
    const peices = [];
    const funcs = [];

    var notesDict = {nums:[], notes:[]};

    function equal() {
        peices[peices.length] = runningTotal
        let tempRun = peices[0];
        const temp = []; //values
        const temp2 = []; // operators

        for (let i = 0; i < funcs.length; i++) {
            switch (funcs[i]) {
                case 3: //mult
                    tempRun = tempRun*peices[i+1];
                    break;
                case 4: //divi
                    tempRun = tempRun/peices[i+1];
                    break;
                case 5: //mod
                    tempRun = tempRun%peices[i+1];
                    break;
                case 1: //addi
                    temp[temp.length] = tempRun;               
                    temp2[temp2.length] = 1;
                    tempRun = peices[i+1];
                    break;
                case 2: //subt
                    temp[temp.length] = tempRun;
                    temp2[temp2.length] = 2;
                    tempRun = peices[i+1];
                    break;
            }
        }
        temp[temp.length] = tempRun;

        tempRun = temp[0];
        for (let i = 0; i < temp2.length; i++) {
            if (temp2[i]==1) { //addi
                tempRun += temp[i+1];
            }
            else { //subt
                tempRun -= temp[i+1];
            }
        }

        document.getElementById("text").innerText = "="+tempRun; //output

        runningTotal = tempRun; //set output state
        state = 1;
        funcs.length = 0;
        peices.length = 0;
    }

    function modif(a) {
        switch (a) {
            case 1:
    	        document.getElementById("text").innerText += "+";
                break;
            case 2: 
    	        document.getElementById("text").innerText += "-";
                break;
            case 3:
    	        document.getElementById("text").innerText += "x";
                break;
            case 4:
    	        document.getElementById("text").innerText += "÷";
                break;
            case 5:
    	        document.getElementById("text").innerText += "%";
                break;
            default:
                return;
        }

        peices[peices.length] = runningTotal;
        runningTotal = 0;
        funcs[funcs.length] = a;
        state = 0;

    }

    function run(a) {
        if (state==1){ // if a number is selected first, then ignore previous answer
            runningTotal = 0;
            state = 0;
        }
        runningTotal = runningTotal+ String(a);
        document.getElementById("text").innerText = runningTotal;
    }

    function note() {
        if (state!==1){return;}
        //update dictionary and count
        notesDict.nums.push(runningTotal);
        notesDict.notes.push(notesDict.notes.length);

        //create row
        const row = document.createElement("tr");

        //create column1 (number)
        const column1 = document.createElement("td");
        const node1 = document.createTextNode(runningTotal.toString());
        column1.appendChild(node1);

        //create colum2 (notes)
        const column2 = document.createElement("td");
        const inputfeild = document.createElement("input");
        column2.appendChild(inputfeild);
        
        //append column1 and 2 to the row
        row.appendChild(column1);
        row.appendChild(column2);
        
        //insert the row after the table header
        document.getElementById("dict").insertAdjacentElement("afterend", row);

        //update the avarage
        let a = 0;
        for (let i = 0; i < notesDict.nums.length; i++) {
            a += notesDict.nums[i];
        }
        document.getElementById("avr").innerText = a/notesDict.nums.length;
    }
    </script>