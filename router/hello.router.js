const express = require("express");

const helloRouter = express();

helloRouter.get("/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const userIPV6 = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userIPV4 = convertIPv6ToIPv4(userIPV6);

  const userObj = {
    clientIP: `${userIPV4}`,
    greeting: `Hello, ${visitorName}`
  }

  res.json(userObj);
});

function convertIPv6ToIPv4(IPV6) {
  if (IPV6.startsWith("::ffff:")) {
    return IPV6.split("::ffff:")[1];
  } else if (IPV6 === "::1") {
    return "127.0.0.1";
  } else {
    return IPV6;
  }
}

module.exports = helloRouter;