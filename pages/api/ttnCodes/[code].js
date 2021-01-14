// api file responsible for fetching a single ttn code
import firestore from "../../../lib/firebase";
import short from "short-uuid";

const handlePost = async (data) => {
  let result = {
    status: 400,
    data: null,
    error: `Bad Request - Malformed data or invalid TTNCODE`,
  };
  try {
    data = JSON.parse(data);
  } catch (e) {
    console.error(`Json already a string error: `);
  }

  const pathToTTN = `/${data.ttnCode}`;
  const codeDocRef = firestore.collection("ttnCodes").doc(pathToTTN); // someone else could have updated it , check again
  const codeDocument = await codeDocRef.get();
  const documentData = codeDocument.data();

  if (!documentData?.isUsed) {
    // valid ttn , now let's check that the email has not been used
    const testResultsCollection = await firestore.collection("TestResults");

    // search for the email
    const matchingEmail = await testResultsCollection.where("email", "==", data.email).get();

    if (!matchingEmail.empty) {
      // matched email to another ttn code
      result.status = 406;
      result.error = "Email has already been used";
      return result;
    }

    const id = short.generate();

    const testResultDoc = await testResultsCollection.doc(id).set(data);

    // now make the ttn code unusuable
    await codeDocRef.update({
      isUsed: true,
    });

    // all done set the response and resolve
    result.status = 200;
    result.data = {
      ...data,
      CreatedAt: testResultDoc.writeTime,
    };
    delete result.error;
  }
  return result;
};

// we will always resolve, reject has no value for us atm
const handleGet = async (code) => {
  const codeDocRef = firestore.collection("ttnCodes").doc("/" + code);
  const codeDocument = await codeDocRef.get();
  let result = {
    status: 404,
    data: null,
    error: `The code ${code} could not be found on the server. Please verify and resubmit`,
  };

  if (codeDocument.exists) {
    // all good
    result.status = 200;
    result.data = codeDocument.data();
    delete result.error;
  }

  // resolve with the error code
  return result;
};

export default async (req, res) => {
  const {
    query: { code },
    method,
    body,
  } = req;

  console.log(`body is? `, body);
  let apiResult = {
    status: 501,
    data: {
      error: `The method type ${method} is currently not supported. Please try a Get or Post Request instead.`,
    },
  };

  switch (method) {
    case "POST": // handle post
      apiResult = await handlePost(body);
      break;
    case "GET":
      apiResult = await handleGet(code);
      break;
  }
  res.status(apiResult.status).json(apiResult);
};
