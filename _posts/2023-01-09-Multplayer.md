---
layout: base
title: Explaining Socket.io
description: explaining socket io, with a simple example
type: ccc
courses: { csse: {week: 19} }
image: /images/platformer/backgrounds/home.png
---
## Socket.io
Socket.io is a streamlined version of normal websockets. It makes it easy to set up the server and send, receive, and broadcast data.

## Client

### socket.on(key,function(arguments))
This is a basic listner, it listens to some event with a given key. When the socket recieves a message on that line it passes the message through the function

```
socket.on("onMessage"(data)=>{
    var message = data.message;
})
```

### socket.emit(key,data)
This is a basic emitter, it emits some message with the key provided

```
var myMessage = "HI!"
socket.emit("message",myMessage);
```

## Server

the server works about the same as the client, but instead listens for messages on the client

```
var name = "user1"
socket.on("message",(message)=>{
    socket.broadcast.emit("onMessage",{message:message,name:name});
})
```
this example included a slightly modified emit, it basically just sends the message to everyone that is not the orignal sender.

## What it can be used for

Socket.io is can be used for sending player positions, telling others when a person joins or leaves a web page, or as an examples above created, a chat function


