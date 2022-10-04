const { getTokenPrimaryKeys, getLastTokenTimestamp } = require('../common/readers');
const { updateToken } = require('../common/writers');

const scrapTokensInformations = async (tokenNames) => {
  const { default: fetch } = await import('node-fetch');
  const url = `${process.env.COINLAYER_ENDPOINT}/live?access_key=${process.env.COINLAYER_ACCESS_KEY}&symbols=${tokenNames.join()}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const calculateEvolutionRate = (before, after) => ((after - before) / before) * 100;

const updateTokens = async (tokenNames) => {
  const tokenInformations = await (await scrapTokensInformations(tokenNames)).json();

  console.log(tokenInformations);

  return Promise.all(tokenNames.map(async (token) => {
    const beforeToken = (await getLastTokenTimestamp(token))[0]?.exchangeRate;
    const newTokenValue = tokenInformations.rates[token];
    const evolutionRate = beforeToken ? calculateEvolutionRate(beforeToken, newTokenValue) : 1;
    return updateToken({
      token,
      exchangeRate: newTokenValue,
      evolutionRate,
      timestamp: `${tokenInformations.timestamp}`,
    });
  }));
};

module.exports.main = async (event) => {
  if (event['detail-type'] === 'Scheduled Event') {
    const tokenNames = await getTokenPrimaryKeys();
    await updateTokens(tokenNames);
  } else {
    await updateTokens(event.tokens);
  }
};
