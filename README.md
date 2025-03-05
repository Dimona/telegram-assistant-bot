# Telegram AI Assistant

**Project Description**  
This project is a Telegram bot that integrates OpenAI's language model (GPT-3.5/GPT-4) and image generation from Stability AI. The bot offers features such as analyzing and summarizing chat messages, detecting tasks and manipulations, as well as generating and modifying images.

**Project Goals**

- Provide users with a convenient tool to automate routine tasks in Telegram, including text summarization, task detection, and image generation/analysis.
- Demonstrate the capabilities of integrating multiple AI services (OpenAI, Stability AI) within a single bot.

---

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Dimona/telegram-assistant-bot.git
   cd telegram-assistant-bot
   ```

2. Copy `.env.example` to `.env` file.

3. **Configure ngrok**

   - Register and login to official ngrok site.
   - Then copy api token that you used for ngrok configuration and paste into `.env` file into `NGROK_API_TOKEN` variable.
     https://dashboard.ngrok.com/get-started/setup/linux
   - Run `npm run ngrok` from root of the project
   - Copy built Forwarding url from console without `https://` and paste into `.env` file into `TELEGRAM_WEBHOOK_DOMAIN` variable

4. **Configure Telegram bot**

   - Open **Telegram**
   - Find `@BotFather` user and open chat with him
   - Send `/start` message which will start the conversation
   - Send `/newbot` message which will start wizard of new bot configuration
   - Specify `name` and `username` of your new bot. You can add avatar via `/setuserpic` if it's necessary
   - You will see success message of bot creation. Please copy HTTP API access token to clipboard and paste into `.env` file into `TELEGRAM_BOT_TOKEN` variable.
   - Specify commands for bot using `/setcommands`
     Choose your just created bot and add command by one message
     ```
     summarize - Summarize messages
     findtodo - Find to do and create task in google calendar
     findmanipulation - Scan messages and recognize manipulations
     generateimage - generates images
     explainimage - explain what is on picture
     changebg - change image background by prompt
     testerror - test Error meesage proxing
     ```
   - **Important!** Send `/setjoingroups` command
     Choose your bot and set status to `Enabled`.
     This is for ability to correctly work in group chats

5. **Setup OpenAI integration**

   - Register/Login on official OpenAI application https://platform.openai.com/
   - Create API key there https://platform.openai.com/settings/organization/api-keys
   - Copy generated secret key which starts from `sk-...` to clipboard and paste into `.env` into `OPEN_AI_API_KEY` variable

6. **Setup StabilityAI integration**

   - Register/Login on official StabilityAI application https://platform.stability.ai/
   - Create API key there https://platform.stability.ai/account/keys
   - Copy generated secret key which starts from `sk-...` to clipboard and paste into `.env` into `STABILITY_AI_API_KEY` variable

7. **Start Application**

   - Run `npm run start:watch` from root of the project
   - In result, you should see the following log message in console
    
     `LOG [NestApplication] Server is listening on 30001 port.`

8. **Check hosting workability**

   - Click on build Forward url in ngrok console
   - You should see JSON

     ```json
     {
       "status": 200,
       "handshake": true
     }
     ```

9. Find your bot in Telegram and start private message with him. You can also add it to group channels

10. Enjoy!!!