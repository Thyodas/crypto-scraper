const { addTokenList, deleteToken } = require('../common/writers');
const { generateResponse } = require('../common/utils');

const deleteTokens = async (event) => {
  const { id } = event.pathParameters;

  if (!id) {
    return generateResponse({
      statusCode: 400,
      body: {
        message: 'Missing id parameter',
      },
    });
  }

  await deleteToken(id);

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

module.exports = { postTokens, deleteTokens };
