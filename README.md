# Lync Chat Client
User interface (UI) for a simple chat application built with Vanilla JavaScript
and JQuery. This application is the frontend component of a simple chat app with
direct messaging functionality where a user can start a chat with another user
and share text messages within the chat. 


## Setup
The Lync Chat app is comprised of two separate backend and frontend components. 
The codebase for the frontend application alone is maintained in this repository.

Before the client application can be run locally, the backend server application
must first be up and running. This is required because the client makes API calls
to the server to fetch data needed to load the UI correctly.

Setup instructions for the server application can be found [here][1].

[1]: <https://github.com/justinharry4/lync-chat-server?#setup>

The steps to set up the client application in a development environment are listed
below:

1. Clone the repository
    ```
    git clone https://github.com/justinharry4/lync-chat-client.git
    ```

    ```
    cd lync-chat-client
    ```

2. Install project dependencies
    ```
    npm install
    ```

3. Start the client application
    ```
    npm start
    ```

The application can then be accessed in a browser at <http://localhost:1234/>


## Usage
Open a web browser and visit <http://localhost:1234/login/>.

Login with any of the credentials:

Username: Henry   
Password: user1pass  

Username: Rebecca  
Password: user2pass  

On successful login, click on the chat in the messages list to open the chatbox.
Messages can then be sent to the other user using the chatbox interface.

Log in with the other user's credentials in a different browser window and open
the chatbox as before to see the messages appear in real-time.

The Login and Chat pages are shown below:

[![Login page screenshot](https://github.com/justinharry4/lync-chat-client/blob/main/public/images/raster/login_screenshot.png?raw=true)](https://github.com/justinharry4/lync-chat-client/blob/main/public/images/raster/login_screenshot.png)


[![Chat page screenshot](https://github.com/justinharry4/lync-chat-client/blob/main/public/images/raster/chat_screenshot.png?raw=true)](https://github.com/justinharry4/lync-chat-client/blob/main/public/images/raster/chat_screenshot.png)


## Application Design
This application is built using Vanilla JavaScript and JQuery. The application 
uses a simple routing system, a custom HTML string parser (powered by JQuery)
and a component-based modular approach to generate an interactive UI.


## Note
The chat client application in this repository is **not production ready**.
It was built primarily to provide a simple user-facing component of the 
chat web application which consumes the backend API.

That being said, any contributions to the project are welcome!