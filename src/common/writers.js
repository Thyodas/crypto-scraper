const AWS = require('aws-sdk');
const { getTokenSortKeys } = require('./readers');

const ddb = new AWS.DynamoDB.DocumentClient();

const addToken = async (token) => ddb.put({
  TableName: process.env.TOKENS_TABLE_NAME,
  Item: {
    tokenId: token,
    timestamp: '$ORIGINAL',
  },
}).promise();

const addTokenList = async (tokenList) => Promise.all(
  tokenList.map((token) => addToken(token)),
);

const deleteTokenWithTimestamp = async (tokenId, timestamps) => Promise.all(
  timestamps.map((timestamp) => ddb.delete({
    TableName: process.env.TOKENS_TABLE_NAME,
    Key: {
      tokenId,
      timestamp,
    },
  }).promise()),
);

const deleteToken = async (token) => {
  const sortKeys = await getTokenSortKeys(token);
  return deleteTokenWithTimestamp(token, sortKeys);
};

module.exports = { addToken, addTokenList, deleteTokenById: deleteToken };
