import firestore from "../../lib/firebase";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async (req, res) => {
  const ttnSnapshot = await firestore.collection("ttnCodes").get();
  const mappedData = ttnSnapshot.docs.map((document) => document.data());
  res.statusCode = 200;
  res.json({
    data: mappedData,
  });
};
