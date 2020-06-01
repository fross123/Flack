# Project 2

Web Programming with Python and JavaScript

This is a basic chatroom application that uses Flask and Socket.IO

## Display Name
On webpage load, user is allowed to make a display name that is tied to all their messsages. Display Name is also stored in localStorage, and is recalled on webpage load. If a user returns, they do not need to re-enter a display name. Future implementation would hide form in this case, but currently the button is simply deactivated.

## Channel Creation
Once a display name is created a user is able to create new channels. The "Create Channel" button is disabled until a display name is created.

## Channel List
A list of channels is vieable once a display name is created. This list was created using bootstrap list group components and buttons.

## Messages View
Once a channel button is clicked, the messages view is displayed and any messages previously sent are displayed as well. The user is also able to send their own messages. If they try to send a message that is more than 100, an error is displayed and user will have to delete messages by using the delete messages button.

## Remembering Channel
Channel is remembered if page is closed and re-opened. All messages are displayed and current user is also remembered.

## Personal Touch
The personal touch is the ability to delete your own messges.
