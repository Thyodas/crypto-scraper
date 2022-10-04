const generateResponse = ({ statusCode = 200, body }) => ({
  statusCode,
  body: JSON.stringify(body),
});

const dbFullQuery = async (ddb, queryParameters) => {
  let result;
  let items = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    result = await ddb.query({
      ...queryParameters,
      ExclusiveStartKey: result?.LastEvaluatedKey,
    }).promise();
    items = items.concat(result.Items);
  } while (result.LastEvaluatedKey);
  return items;
};

const dbFullScan = async (ddb, scanParameters) => {
  let result;
  let items = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    result = await ddb.scan({
      ...scanParameters,
      ExclusiveStartKey: result?.LastEvaluatedKey,
    }).promise();
    items = items.concat(result.Items);
  } while (result.LastEvaluatedKey);
  return items;
};

module.exports = { generateResponse, dbFullQuery, dbFullScan };
