const AWS = require('aws-sdk');
const { addTokenList, deleteTokenById } = require('../common/writers');
const { generateResponse } = require('../common/utils');
const { getLastTokenTimestamp, getTokenPrimaryKeys } = require('../common/readers');

const lambda = new AWS.Lambda({
  endpoint: `lambda.${process.env.REGION}.amazonaws.com`,
});

const deleteToken = async (event) => {
  const { id } = event.pathParameters;

  if (!id) {
    return generateResponse({
      statusCode: 400,
      body: {
        message: 'Missing id parameter',
      },
    });
  }

  await deleteTokenById(id);

  return generateResponse({
    statusCode: 200,
    body: {
      message: 'Token successfully removed',
    },
  });
};

const postTokens = async (event) => {
  const body = JSON.parse(event.body);
  if (!body || !body.tokens) {
    return generateResponse({
      statusCode: 400,
      body: {
        message: 'Missing input token list',
      },
    });
  }
  const payload = {
    tokens: body.tokens,
  };
  const result = await lambda.invoke({
    FunctionName: process.env.SCRAPER_FUNCTION_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify(payload),
  }).promise();

  console.log(`${process.env.SCRAPER_FUNCTION_NAME} invoked`, result);
  await addTokenList(body.tokens);

  return generateResponse({
    statusCode: 200,
    body: {
      message: 'Tokens successfully added',
    },
  });
};

const getToken = async (event) => {
  const { id } = event.pathParameters;

  const limitString = event.queryStringParameters?.limit;
  const limit = limitString ? parseInt(limitString, 10) : undefined;

  if (!id) {
    return generateResponse({
      statusCode: 400,
      body: {
        message: 'Missing id parameter',
      },
    });
  }
  if (Number.isNaN(limit) || limit <= 0) {
    return generateResponse({
      statusCode: 400,
      body: {
        message: 'Wrong limit parameter',
      },
    });
  }

  const tokenHistory = await getLastTokenTimestamp(id, limit || 5);

  return generateResponse({
    statusCode: 200,
    body: {
      tokenHistory,
    },
  });
};

const getTokens = async () => {
  const tokenNames = await getTokenPrimaryKeys();
  const allTokens = await Promise.all(
    tokenNames.map(async (tokenId) => getLastTokenTimestamp(tokenId)),
  );

  return generateResponse({
    statusCode: 200,
    body: {
      tokens: allTokens.map((token) => token[0]),
    },
  });
};

module.exports = {
  postTokens, deleteToken, getToken, getTokens,
};
