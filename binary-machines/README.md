Test Task

Client Server (both NodeJS)
Step 1. The client sends to the server GET-request 
(query: some random ID-string) and receive JWT with contains this ID 

Step 2. The client open socket.IO connection with server. 
The server have to check JWT validity (simple validation)

Step 3. The server select some data from mongoose and sends to the client via an opened socket.IO connection and the client sends some response to the server (data structure - as you wish - for example abstract user profile)

All received and sent data (Fastify and Socket.IO) must be validated with Joe or Ajv 

If Fastify is hard you can use Express.

Send me result when u will ready.