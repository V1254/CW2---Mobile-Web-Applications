import authenticated from "../../lib/authHandler";
import cookie from "cookie";

export default authenticated(async (req, res) => {
  const { query } = req;
  console.log(query);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("authToken", "", {
      maxAge: -1,
      path: "/",
    })
  );

  if (query && query.redirect && query.url) {
    res.writeHead(302, { location: url });
    res.end();
    return;
  }

  return res.status(200).json({
    message: "Successfully Logged Out!",
  });
});
