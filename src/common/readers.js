const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

const getTokenSortKeys = async (token) => {
  let result;
  let sortKeys = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    result = await ddb.scan({
      TableName: process.env.TOKENS_TABLE_NAME,
      FilterExpression: 'tokenId = :token',
      ExpressionAttributeValues: {
        ':token': token,
      },
      ExclusiveStartKey: result?.LastEvaluatedKey,
    }).promise();
    sortKeys = sortKeys.concat(result.Items.map((item) => item.timestamp));
  } while (result.LastEvaluatedKey);
  return sortKeys;
};

module.exports = { getTokenSortKeys };
