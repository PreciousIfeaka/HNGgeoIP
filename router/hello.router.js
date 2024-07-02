const axios = require("axios");
const express = require("express");
const ipaddr = require("ipaddr.js");
require("dotenv").config();

const helloRouter = express();
const API_KEY = process.env.WEATHERSTACK_API_KEY;
const IP_TOKEN = process.env.IPINFO_TOKEN;

// router for /hello route
helloRouter.get("/hello", async (req, res) => {
  if (req.query) {
    const { visitor_name } = req.query;
    const visitorName = visitor_name.split('"').join('');

    const userIPV6 = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // convert ipv6 to v4
    let userIPV4;
    let addr = ipaddr.parse(userIPV6);
    if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
      userIPV4 = await addr.toIPv4Address().toString();
    } else if (addr.kind() === 'ipv4') {
      userIPV4 = userIPV6.toString();
    } else if (userIPV6 === "::1") {
      userIPV4 = "127.0.0.1"
    } else {
      return res.send(`Your IPV6 adress is ${userIPV6}. It is not an IPV4 mapped address`);
    }

    //geoip lookup
    const geo = await axios.get(`https://api.ipbase.com/v2/info?apikey=${IP_TOKEN}&ip=${userIPV4}`);
    // console.log(geo.data.city);

    const options = {
      method: "GET",
      url: `http://api.weatherstack.com/current?access_key=${API_KEY}`,
      params: {
        query: `${geo.data.data.location.city.name}`,
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
  } else {
    return res.json({
      Error: "Sorry, you have to include a query parameter."
    })
  }
});

module.exports = helloRouter;