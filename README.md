# socket chat in nodejs using mongodb

---

**single and group chat**

- users table
- chat table
- room table
- take type field in room table as enum whose values would be ['single', 'group'] to indicate one-to-one chat or group chat

**_socket events_**

- use the same event name on client and server side

**Authentication in socket**

- Authenticating Socket.io using JWT
- socket.handshake.query.token

---

---

_in this project we are using socket v2.x_

To know more about sockets visit [Socket.io](https://socket.io/docs/v2/)
