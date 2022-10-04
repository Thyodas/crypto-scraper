const { addTokenList, deleteTokenById } = require('../common/writers');
const { generateResponse } = require('../common/utils');
const { getLastTokenTimestamp, getTokenPrimaryKeys } = require('../common/readers');

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

  if (!id) {
    return generateResponse({
      statusCode: 400,
      body: {
        message: 'Missing id parameter',
      },
    });
  }

  const lastToken = await getLastTokenTimestamp(id);

  return generateResponse({
    statusCode: 200,
    body: {
      token: lastToken,
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
      tokens: allTokens,
    },
  });
};

module.exports = {
  postTokens, deleteToken, getToken, getTokens,
};
