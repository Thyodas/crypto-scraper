const AWS = require('aws-sdk');
const { dbFullQuery, dbFullScan } = require('./utils');

const ddb = new AWS.DynamoDB.DocumentClient();

const getTokenSortKeys = async (token) => {
  const param = {
    TableName: process.env.TOKENS_TABLE_NAME,
    KeyConditionExpression: 'tokenId = :token',
    ExpressionAttributeValues: {
      ':token': token,
    },
  };
  const sortKeys = await dbFullQuery(ddb, param);
  return sortKeys.map((item) => item.timestamp);
};

const getTokenPrimaryKeys = async () => {
  const param = {
    TableName: process.env.TOKENS_TABLE_NAME,
    FilterExpression: '#timestamp = :timestampInput',
    ExpressionAttributeNames: {
      '#timestamp': 'timestamp',
    },
    ExpressionAttributeValues: {
      ':timestampInput': '$ORIGINAL',
    },
  };
  const primaryKeys = await dbFullScan(ddb, param);
  return primaryKeys.map((item) => item.tokenId);
};

const getLastTokenTimestamp = async (tokenId, limit = 1) => {
  const param = {
    TableName: process.env.TOKENS_TABLE_NAME,
    Limit: limit,
    ScanIndexForward: false,
    KeyConditionExpression: 'tokenId = :token',
    ExpressionAttributeValues: {
      ':token': tokenId,
    },
  };
  return (await dbFullQuery(ddb, param))[0];
};

module.exports = { getTokenSortKeys, getTokenPrimaryKeys, getLastTokenTimestamp };
