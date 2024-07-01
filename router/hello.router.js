const axios = require("axios");
const express = require("express");
const ipaddr = require("ipaddr.js");
const geoIP2 = require("geoip-lite2");

const helloRouter = express();
const apiKey = process.env.WEATHERSTACK_API_KEY;

// router for /hello route
helloRouter.get("/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const userIPV6 = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let userIPV4;
  if (ipaddr.parse(userIPV6).isIPv4MappedAddress()) {
    userIPV4 = await ipaddr.parse(userIPV6).toIPv4Address();
  } else if (userIPV6 === "::1") {
    userIPV4 = "127.0.0.1"
  } else {
    return res.send(`Your IPV6 adress is ${userIPV6}. It is not an IPV4 mapped address`);
  }

  //geoip lookup
  const geo = geoIP2.lookup("102.88.68.96");
  // console.log(geo.city);

  const options = {
    method: "GET",
    url: `http://api.weatherstack.com/current?access_key=${apiKey}`,
    params: {
      query: `${geo.city}`,
    }
  };
  //axios request on weather api
  try {
    const response = await axios.request(options);
    const geodata = response.data
    // console.log(geodata);

  //object to be returned
  const userObj = {
    client_ip: `${userIPV4}`,
    location: `${geodata.location.name}`,
    greeting: `Hello, ${visitorName}!, the temperature is ${geodata.current.temperature} degrees Celcius in ${geodata.location.name}`
  }
  res.json(userObj);
  } catch (error) {
    console.error(error);
  }
});

module.exports = helloRouter;