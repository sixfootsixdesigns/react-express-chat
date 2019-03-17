# Chat App

## Description
This app uses a `React` front end with an `Express` backend. Both the server and client are written in `Typescript`.

I used `Prettier` to format the code.

I used `Socket.IO` to allow the client to listen for when users enter the chat room, leave the chat room, or add a new message.

I wrote a super simple in memory store for the chat data that sits on the server. It keeps the 50 most recent messages in the store. Ideally this would be swapped out for a datastore like HBase but I didn't have time to implement something like that as my 3 week old is screaming bloody murder at me whenever I try to work on this...

For testing I used `Jest`, `Supertest`, and `React Testing Library`.

When you open the app, you should see a screen where you enter your name and then click join. Once you have joined, you will see other users in the room on the right, messages on the left, and a textarea on the bottom
to add your message to the chat.

## Running in dev mode
- run `$ yarn` to install dependencies. 
- run `$ yarn dev:server` in one terminal.
- run `$ yarn dev:client` in another terminal.
- The app should be up on [http://localhost:3000/](http://localhost:3000/)
- The server should be up on [http://localhost:4001/](http://localhost:4001/)

## Running built version
- run `$ yarn build`
- run `$ yarn start`
- The app should be up on [http://localhost:4001/](http://localhost:4001/)

## Running tests
- run `$ yarn test:server` to test the server
- run `$ yarn test:client` to test the client
- run `$ yarn test` to test both
