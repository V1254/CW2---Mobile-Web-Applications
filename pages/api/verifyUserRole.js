import jwt from "jsonwebtoken";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async (req, res) => {
  const { body } = req;
  const cookie = req.cookies.authToken;

  if (!body) {
    return res.status(400).json({
      error: `Please Pass in the Role to validate against as a 'roleIs' parameters. E.g: 'roleIs': 'admin'`,
    });
  }

  if (!cookie) {
    console.error(`Error: Verify User Role- received no cookie: `, cookie);
    return res.status(401).json({
      error: `This route requires authenticated users`,
    });
  }

  const { roleIs } = body;

  return jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      const { role: actualRole } = decoded;
      const status = actualRole === roleIs ? 200 : 404;
      return res.status(status).json({
        status,
        msg: `The user is ${actualRole === roleIs ? "a" : "not an"} ${roleIs}`,
      });
    }

    console.log(err);
    return res.status(404).json({
      status,
      msg: `The cookie could not be validated!`,
    });
  });
};
