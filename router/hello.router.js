const axios = require("axios");
const express = require("express");
const ipaddr = require("ipaddr.js");
require("dotenv").config();

const helloRouter = express();
const API_KEY = process.env.WEATHERSTACK_API_KEY;
const IP_TOKEN = process.env.IPINFO_TOKEN;

// router for /hello route
helloRouter.get("/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const userIPV6 = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // convert ipv6 to v4
  let userIPV4;
  if (ipaddr.parse(userIPV6).isIPv4MappedAddress()) {
    userIPV4 = await ipaddr.parse(userIPV6).toIPv4Address();
  } else if (userIPV6 === "::1") {
    userIPV4 = "127.0.0.1"
  } else {
    return res.send(`Your IPV6 adress is ${userIPV6}. It is not an IPV4 mapped address`);
  }

  //geoip lookup
  const geo = await axios.get(`https://ipinfo.io/${userIPV4}?token=${IP_TOKEN}`);
  // console.log(geo.data.city);

  const options = {
    method: "GET",
    url: `http://api.weatherstack.com/current?access_key=${API_KEY}`,
    params: {
      query: `${geo.data.city}`,
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