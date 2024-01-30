// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  if (req.method === 'GET') {
    // Set the total count to the number of items in the response
    const totalCount = router.db.get('posts').value().length;
    res.header('X-Total-Count', totalCount);
  }
  // Continue to JSON Server router
  next();
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
