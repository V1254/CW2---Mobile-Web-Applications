const ageGroups = {
  YOUNG: "0-17",
  OLD: "18-44",
  OLDER: "45-64",
  OLDEST: "65+",
};

const getAgeGroup = (age) => {
  if (age >= 0 && age <= 17) {
    return ageGroups.YOUNG;
  } else if (age >= 18 && age <= 44) {
    return ageGroups.OLD;
  } else if (age >= 45 && age <= 64) {
    return ageGroups.OLDER;
  } else {
    return ageGroups.OLDEST;
  }
};

const getLowerAgeFromGroup = (group) => {
  switch (group) {
    case ageGroups.YOUNG:
      return 0;
    case ageGroups.OLD:
      return 18;
    case ageGroups.OLDER:
      return 45;
    case ageGroups.OLDEST:
      return 65;
    default:
      return -1;
  }
};

const testResultToCount = (currentData, testResult) => {
  if (testResult === "Positive") {
    const newCountPositive = currentData.countPositive + 1;
    return {
      ...currentData,
      countPositive: newCountPositive,
    };
  } else if (testResult === "Negative") {
    const newCountNegative = currentData.countNegative + 1;
    return {
      ...currentData,
      countNegative: newCountNegative,
    };
  } else {
    const newCountInconclusive = currentData.countInconclusive + 1;
    return {
      ...currentData,
      countInconclusive: newCountInconclusive,
    };
  }
};

/**
 * maps data as follows:
 *
 * ageGroups: young,old,older,oldest
 *
 * [
 *  {
 *    "ageGroup": "0-17,18-44,45-64,65+",
 *    "countPositive": "number",
 *    "countNegative": "number",
 *    "countInconclusive": "number",
 *  }
 *
 *
 * ]
 * @param {*} data
 */
const mapByAgeGroup = (data) =>
  data
    .reduce((acc, { testResult, age }) => {
      const ageGroup = getAgeGroup(age);
      const existingAgeGroupIndex = acc.findIndex((el) => el.ageGroup === ageGroup); // countPositive, countNegative,countInconclusive

      if (existingAgeGroupIndex === -1) {
        const counts = {
          countPositive: 0,
          countNegative: 0,
          countInconclusive: 0,
        };
        acc.push({
          ageGroup,
          recorded: age,
          recordedResult: testResult,
          ...testResultToCount(counts, testResult),
        });
      } else {
        const dataAtIndex = acc[existingAgeGroupIndex];
        const newData = testResultToCount(dataAtIndex, testResult);
        newData.recorded += `,${age}`;
        newData.recordedResult += `,${testResult}`;
        acc[existingAgeGroupIndex] = newData;
      }
      return acc;
    }, [])
    .sort((a, b) => {
      const { ageGroup: firstAgeGroup } = a;
      const { ageGroup: secondAgeGroup } = b;
      // sort in ascending order (Young -> Oldest)
      return getLowerAgeFromGroup(firstAgeGroup) - getLowerAgeFromGroup(secondAgeGroup);
    });

/**
 *  Maps the Data to the produce the following array
 *  [
 *      { type: "Positive",     cases: number | 0 },
 *      { type: "Negative",     cases: number | 0 }.
 *      { type: "Inconclusive", cases: number | 0 }
 *  ]
 * @param {*} data
 */
const mapByResultCount = (data) =>
  data.reduce(
    (acc, { testResult }) => {
      if (testResult === "Positive") {
        acc[0].cases += 1;
      } else if (testResult === "Negative") {
        acc[1].cases += 1;
      } else {
        acc[2].cases += 1;
      }

      return acc;
    },
    [
      { type: "Positive", cases: 0 },
      { type: "Negative", cases: 0 },
      { type: "Inconclusive", cases: 0 },
    ]
  );

const roundNiceley = (number) => (number ? Math.round(number * 10) / 10 : number); // round to 1 decimal place.

/**
 *  Maps the data as follows:
 *  [
 *    {
 *      ageGroup: string < one of each age group abovee >
 *      totalInfected: number < total positive covid cases for this age group >
 *      totalInAgeGroup: number < total number of people who reported a result in this age group >
 *      infectionRate: number < totalInfected / totalInAgeGroup * 100 >
 *
 *    }
 *  ]
 * @param {*} data
 */
const mapByPositiveAgeGroup = (data) => {
  const globalInfectedCount = data.reduce(
    (acc, { testResult }) => (testResult === "Positive" ? acc + 1 : acc),
    0
  );

  console.log(`globalinfected: `, globalInfectedCount);
  if (!globalInfectedCount) return data;

  return data
    .reduce(
      (acc, { age, testResult }) => {
        const ageGroup = getAgeGroup(age);
        const groupAccumulator = acc.find((el) => el.ageGroup === ageGroup);
        groupAccumulator.totalInAgeGroup++;

        if (testResult === "Positive") {
          groupAccumulator.totalInfected++;
        }
        return acc;
      },
      [
        {
          ageGroup: ageGroups.YOUNG,
          totalInfected: 0,
          totalInAgeGroup: 0,
          infectionRate: 0,
          globalInfected: globalInfectedCount,
        },
        {
          ageGroup: ageGroups.OLD,
          totalInfected: 0,
          totalInAgeGroup: 0,
          infectionRate: 0,
          globalInfected: globalInfectedCount,
        },
        {
          ageGroup: ageGroups.OLDER,
          totalInfected: 0,
          totalInAgeGroup: 0,
          infectionRate: 0,
          globalInfected: globalInfectedCount,
        },
        {
          ageGroup: ageGroups.OLDEST,
          totalInfected: 0,
          totalInAgeGroup: 0,
          infectionRate: 0,
          globalInfected: globalInfectedCount,
        },
      ]
    )
    .map((el) => ({
      ...el,
      infectionRate: el.totalInfected
        ? roundNiceley((el.totalInfected / globalInfectedCount) * 100)
        : el.totalInfected,
    }));
};

/**
 * Aggregates the positive cases by postcode 
 * Maps data as follows:
 *  [
      {
         postcode: string < some postcode from the documents >
         totalInfected: number < total positive in this postcode >
         totalInPostCode: number < total people who live at this postcode >
         globalInfected: number < global variable >
         infectionRate: number < total Infected / globalInfect >
     }
 *  ]
 * @param {*} data
 * @param {*} type
 */
const mapByPositivePostCode = (data) => {
  const globalInfectedCount = data.reduce(
    (acc, { testResult }) => (testResult === "Positive" ? acc + 1 : acc),
    0
  );

  console.log(`globalinfected: `, globalInfectedCount);
  if (!globalInfectedCount) return data;

  const mappedData = data.reduce((acc, { postcode, testResult }) => {
    if (acc.hasOwnProperty(postcode)) {
      // already exists update our aggregate data
      const existData = acc[postcode];
      const totalInfected = existData.totalInfected;
      const newInfected = testResult === "Positive" ? totalInfected + 1 : totalInfected;
      existData.totalInfected = newInfected;
      existData.totalInPostCode++;
      acc[postcode].infectionRate = newInfected
        ? (existData.totalInfected / globalInfectedCount) * 100
        : newInfected;
    } else {
      // new postcode default values
      const startCount = testResult === "Positive" ? 1 : 0;
      acc[postcode] = {
        postcode,
        totalInfected: startCount,
        totalInPostCode: 1,
        globalInfected: globalInfectedCount,
        infectionRate: startCount ? (startCount / globalInfectedCount) * 100 : startCount,
      };
    }

    return acc;
  }, {});

  // turn to array and return to user
  console.log(`mapped data`, mappedData);
  return Object.entries(mappedData).map(([, value]) => ({
    ...value,
    infectionRate: roundNiceley(value.infectionRate),
  }));
};

export default {
  mapByAgeGroup,
  mapByResultCount,
  mapByPositiveAgeGroup,
  mapByPositivePostCode,
};
