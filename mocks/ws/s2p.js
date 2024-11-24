await page.routeWebSocket(/.+\/api/, (ws) => {
  const server = ws.connectToServer();
  server.onMessage((message) => {
    if (message === '{"command":"pong"}') {
      ws.send('{"command":"fooBar"}');
    } else {
      ws.send(message);
    }
  });
});
