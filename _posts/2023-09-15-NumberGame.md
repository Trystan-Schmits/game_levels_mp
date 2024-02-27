---
comments: False
layout: default
title: Higher or Lower
description: Simple Higher or Lower game
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
</style>

<h>Higher or Lower</h>
<button id="show" class="show" onClick="start()">start</button>
<div id="hide" class="hide">
    <input id="input" type="number" onfocus="this.value=''" min=0 max=100/>
    <button onClick="check()">submit</button>
</div>
<p id="text"></p>

<script>
    let num = 0;
    let count = 0;
    function start(){
        document.getElementById("show").setAttribute("class", "hide");
        document.getElementById("hide").setAttribute("class", "show");
        document.getElementById("text").innerText = "";
        num = Math.round(Math.random() * 100);
    }
    function check(){
        let guess = document.getElementById("input").value;
        if (guess == num) {
            document.getElementById("text").innerText = "You Win! The number was ("+num+") and it took you ("+(count+1)+") guesses.";
            document.getElementById("show").setAttribute("class", "show");
            document.getElementById("hide").setAttribute("class", "hide");
            count = 0;
        } 
        else if (guess > num) {
            document.getElementById("text").innerText = "Too high!"
            count += 1;
        }
        else if (guess < num) {
            document.getElementById("text").innerText = "Too low!"
            count +=1;
        }
    }
</script>