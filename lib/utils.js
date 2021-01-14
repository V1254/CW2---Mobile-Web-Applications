import Cookies from "cookies";
import jwt from "jsonwebtoken";
import fetch from "isomorphic-unfetch";
import Router from "next/router";
export default {
  isValidGender: (gender) => ["Male", "Female", "Other"].includes(gender),
  isValidTestResult: (testResult) => ["Positive", "Negative", "Inconclusive"].includes(testResult),
  isValidTTNCode: async (code) => {
    const response = await fetch(`/api/ttnCodes/${code}`);
    const responseBody = await response.json();
    const { data, error } = responseBody;
    if (error) return false;
    return data.hasOwnProperty("isUsed") ? !data.isUsed : true;
  },
  isValidAge: (age) => /^\d+$/.test(age) && age > 0 && age % 1 === 0,
  persistTestResult: async (data) => {
    const response = await fetch(`/api/ttnCodes/${data.ttnCode}`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseBody = await response.json();
    return responseBody;
  },
  handlePost: async (url, data, cookie) => {
    let stringifiedData;
    if (data) {
      stringifiedData = JSON.stringify({
        ...data,
      });
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          cookie,
        },
        body: stringifiedData,
      });

      const data = await response.json();
      return [response.status, data];
    } catch (e) {
      console.error(`Encountered error on post, `, e);
      return [405, e];
    }
  },
  handleGet: async (url, cookie) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          cookie,
        },
      });

      const data = await response.json();
      return [response.status, data];
    } catch (e) {
      console.error(`Encountered error on get, `, e);
      return [405, e];
    }
  },
  isAuthenticated: (req, res) => {
    const cookie = req?.headers.cookie;
    console.log(`token all god bruv [1] =`, cookie);
    if (!cookie) return false;
    const cookieParser = new Cookies(req, res);
    const authCookie = cookieParser.get("authToken");
    return jwt.verify(authCookie, process.env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        console.log(`errored on token verif: `, err, decoded);
        return false;
      }
      return true;
    });
  },
  moveToLocation: (res, location) => {
    if (typeof window === "undefined") {
      // on the server
      res.writeHead(302, { location });
      res.end();
      return;
    }
    // on the client, use normal routing
    Router.push(location);
  },
};
