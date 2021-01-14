import authenticated from "../../lib/authHandler";
import firestore from "../../lib/firebase";
import utils from "../../lib/dashboard.utils";

export default authenticated(async function (req, res) {
  const { method, body, query } = req;
  const mode = query.mode; // supports raw mode to return the dataset unmonipulated from the db

  if (method !== "GET") {
    res.status(501);
    res.json({
      error: `The method type: ${method} is not supported. Please try a GET Request instead`,
    });
    return;
  }

  // check cookie user role before displaying the results to them
  if (!body?.role || body.role !== "admin") {
    // dashboard is only for admins return
    return res.status(403).json({
      error: `This Route/Page is only available for administrators.`,
    });
  }

  // return all the test results so far..
  const testCollection = await firestore.collection("TestResults");
  const snapShots = await testCollection.get();
  const data = snapShots.docs.map((doc) => doc.data());

  if (mode === "aggregate") {
    const result = {
      byAgeGroup: utils.mapByAgeGroup(data),
      byResultCount: utils.mapByResultCount(data),
      byPositiveAgeGroup: utils.mapByPositiveAgeGroup(data),
      byPositivePostCode: utils.mapByPositivePostCode(data),
    };

    return res.status(200).json({
      data: result,
    });
  }
  res.status(200).json({
    data,
  });
});
