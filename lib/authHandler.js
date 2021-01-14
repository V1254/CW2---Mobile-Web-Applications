import jwt from "jsonwebtoken";
const authenticated = (callback) => async (req, res) => {
  let resultStatus = 401,
    error = "sorry you are not authenticated.";
  const cookie = req.cookies.authToken;

  if (!cookie) {
    console.error(`no cookie found - received: `, cookie);
    return res.status(resultStatus).json({
      error,
    });
  }

  return jwt.verify(cookie, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err && decoded) {
      const { role } = decoded;
      const newBody = Object.assign({}, req.body, { role });
      req.body = newBody;
      return await callback(req, res);
    }
    console.error(`Encountered error during verification..`);
    return res.status(resultStatus).json({
      error,
    });
  });
};

export default authenticated;
