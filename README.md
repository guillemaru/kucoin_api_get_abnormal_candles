[Create your Telegram bot and obtain a bot token id](https://core.telegram.org/bots/tutorial#obtain-your-bot-token)
[Get the chat id where messages will be sent](https://sean-bradley.medium.com/get-telegram-chat-id-80b575520659)

Use the Kucoin API to get candle information on the crypto pairs of your choice, and send a Telegram message to a bot you create whenever a candle of any pair is big enough!
Hopefully you can use that information to make trading decisions.

# Requirements
Set the following environment variables:
KUCOIN_CANDLES_THRESHOLD_PERCENTAGE (e.g. 5)
KUCOIN_CANDLES_THRESHOLD_VOLUME (in USD, e.g. 1000)
KUCOIN_CANDLES_BOT_ID (e.g. 3283212966:AQGRW9NjcCoTRnrkSbz_UAu6dFOy-joOh7Y)
KUCOIN_CANDLES_CHAT_ID (e.g. 5143284951)

# Running the application with Docker
Use the provided Dockerfile to build a Docker image or directly pull from Dockerhub: docker pull guillemaru/cryptocandles
https://hub.docker.com/r/guillemaru/cryptocandles

# Getting an executable
Have a Mac or Linux and want to make this an executable so you just have to click twice and let the program run on your computer?
Execute the following commands at the same directory level as main.js  
$ npm i nexe -g  
$ nexe -h  
$ nexe main.js --build  
