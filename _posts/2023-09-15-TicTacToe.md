---
comments: False
layout: post
title: Tic Tac Toe
description: Simple Tic Tac Toe game
type: ccc
courses: {'csse': {'week': 4}}
categories: ['C4.1']
---
<style>
    .show{
        display: block;
    }
    .hide{
        display: none;
    }
    .flex{
        display: flex;
        flex-direction: row;
    }
    .box{
        width: 50px;
        height: 50px;
        font-size: 100%;
    }
</style>

<h>Tic Tac Toe</h>
<button id="show" class="show" onClick="start()">start</button>
<div id="hide" class="hide">
    <div class="flex">
        <button id=1 class="box" onClick="check(this.id)"></button>
        <button id=2 class="box" onClick="check(this.id)"></button>
        <button id=3 class="box" onClick="check(this.id)"></button>
    </div>
    <div class="flex">
        <button id=4 class="box" onClick="check(this.id)"></button>
        <button id=5 class="box" onClick="check(this.id)"></button>
        <button id=6 class="box" onClick="check(this.id)"></button>
    </div>
    <div class="flex">
        <button id=7 class="box" onClick="check(this.id)"></button>
        <button id=8 class="box" onClick="check(this.id)"></button>
        <button id=9 class="box" onClick="check(this.id)"></button>
    </div>
</div>
<p id="text"></p>

<script>
    const board = new Array(10);
    var turn = false;
    function start(){
        document.getElementById("show").setAttribute("class", "hide");
        document.getElementById("hide").setAttribute("class", "show");
        document.getElementById("text").innerText = "";
        for (let i = 1; i < 10; i++) {
            document.getElementById(i).innerText = "";
        }
        board.length = 0;
        board = new Array(10);
    }
    function check(p){
        if (typeof board[p] !== "undefined"){return;};
        turn = !turn;
        board[p] = turn;
        document.getElementById(p).innerText = String(turn).replace("true","X").replace("false","O");
        if ((board[1] == board[2] && board[1] == board[3] && !(board[1]==undefined))||//row 1
            (board[4] == board[5] && board[4] == board[6] && !(board[4]==undefined))||//row 2
            (board[7] == board[8] && board[7] == board[9] && !(board[7]==undefined))||//row 3
            (board[1] == board[4] && board[1] == board[7] && !(board[1]==undefined))||//col 1
            (board[2] == board[5] && board[2] == board[8] && !(board[2]==undefined))||//col 2
            (board[3] == board[6] && board[3] == board[9] && !(board[3]==undefined))||//col 3
            (board[1] == board[5] && board[1] == board[9] && !(board[1]==undefined))||//dia 1
            (board[3] == board[5] && board[3] == board[7] && !(board[3]==undefined))){//dia 2
                document.getElementById("show").setAttribute("class", "show");
                document.getElementById("hide").setAttribute("class", "hide");
                document.getElementById("text").innerText = String(turn).replace("true","Player 1 ").replace("false","Player 2 ")+"wins!";
                return;
            }
        for (let i = 1; i < 10; i++) {
            if (typeof board[i] == "undefined"){return;};
        }
        document.getElementById("show").setAttribute("class", "show");
        document.getElementById("hide").setAttribute("class", "hide");
        document.getElementById("text").innerText = "Tie";
    }
</script>