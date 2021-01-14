import firestore from "../../lib/firebase";
import bcrypyt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async (req, res) => {
  const { body, method } = req;
  if (method !== "POST")
    return res.status(501).json({
      error: `The method type ${method} is currently not supported. Please try a Get or Post Request instead.`,
    });

  let loginData;
  try {
    loginData = JSON.parse(body);
  } catch (e) {
    console.error(`Json already a string`);
    loginData = body;
  }

  const { username, password } = loginData;

  if (!username || !password) {
    return res.status(400).json({
      error: `No user or password provided. Received username:${username} | passsword: ${password}`,
    });
  }

  const usersRef = firestore.collection("Users");
  const userToLoginSnapshot = await usersRef.where("username", "==", username).get();

  if (userToLoginSnapshot.empty) {
    return res.status(404).json({
      error: `The username: ${username} does not exist.`,
    });
  }

  // username exists in our database, now we need to compare the hashed passwords
  const { password: dbPassword, role } = userToLoginSnapshot.docs[0].data();
  const isEqual = await bcrypyt.compare(password, dbPassword); // bcrypt's compare implementation with the hashed password

  if (isEqual) {
    // passwords match lets verify the auth
    const claims = { username, role };
    const token = jwt.sign(claims, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("authToken", token, {
        httpOnly: true, // js should not be able to read the cookies
        secure: process.env.NODE_ENV !== "development", // transfer over https if not in development
        sameSite: true, // strict
        maxAge: 7200, // match the jwt
        path: "/", // root of our domain, otherwise this will map to /api
      })
    );

    res.status(200).json({
      message: "Successfully Authenticated",
    });
  } else {
    console.error(`Incorrect password provided`);
    return res.status(404).json({
      error: "Invalid Password provided",
    });
  }
};
