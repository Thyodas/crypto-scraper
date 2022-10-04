const generateResponse = ({ statusCode = 200, body }) => ({
  statusCode,
  body: JSON.stringify(body),
});

module.exports = { generateResponse };
