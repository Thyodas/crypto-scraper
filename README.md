# Crypto Scraper

A tool to periodically scrape your crypto currency rates.

## Setup

You have to configure some environment variables before deploying this project.

In a `.env` file put these variables:

```dotenv
COINLAYER_ENDPOINT= coinlayer api link
COINLAYER_ACCESS_KEY= your secret access key
SCRAP_DELAY= delay in minute
```

## Deploy

You can deploy this project on AWS with the serverless framework

````shell
serverless deploy --stage anyStageName
````

If you are using AWS vault:
````shell
aws-vault exec account -- serverless deploy --stage anyStageName
````

## Usage

There are 4 different routes in the API:
### POST /tokens

Takes token names in body

#### Input

Example of body:
````json
{
    "tokens": ["BTC", "LTC", "ETH"]
}
````

#### Response

On success
````json
{
    "message": "Tokens successfully added"
}
````

### GET /tokens
Get all tokens and their last values

#### Response

Example of response
````json
{
  "tokens": [
    {
      "evolutionRate": -0.05086613401331756,
      "tokenId": "LTC",
      "exchangeRate": 55.3014,
      "timestamp": "1664923686"
    },
    {
      "evolutionRate": 0.049762546777313656,
      "tokenId": "ETH",
      "exchangeRate": 1357.34,
      "timestamp": "1664923686"
    },
    {
      "evolutionRate": 0.026646140005250903,
      "tokenId": "BTC",
      "exchangeRate": 20209.067784,
      "timestamp": "1664923686"
    }
  ]
}
````

### GET /tokens/{id}
Get a specific token and get all its value history

### Input

`limit` can be set as an optional query parameter to limit history size

#### Response

Example of response
````json
{
    "tokenHistory": [
        {
            "evolutionRate": 0.026646140005250903,
            "tokenId": "BTC",
            "exchangeRate": 20209.067784,
            "timestamp": "1664923686"
        },
        {
            "evolutionRate": 1,
            "tokenId": "BTC",
            "exchangeRate": 20203.684282,
            "timestamp": "1664923162016"
        }
    ]
}
````

### DELETE /tokens/{id}
Delete a specific token

#### Response

On success
````json
{
    "message": "Token successfully deleted"
}
````
