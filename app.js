const { App } = require('@slack/bolt');
const { admin } = require('./lib/commands/admin')
const { listPrivate } = require('./lib/commands/list-private')

// Initializes your app with your bot token and app token
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
});

app.command('/admin', admin);
app.command('/list-private', listPrivate);

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

