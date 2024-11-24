await page.routeWebSocket(/.+\/api/, (ws) => {
  ws.onMessage((message) => {
    if (message === '{"command":"ping"}') {
      ws.send('{"command":"fooBar"}');
    }
  });
});
