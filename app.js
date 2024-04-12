const { App } = require('@slack/bolt');
const { redisStore } = require('./lib/util/redis-store');

const { admin } = require('./lib/commands/admin');
const { help } = require('./lib/commands/help');
const { listPrivate } = require('./lib/commands/list-private');
const { joinPrivate } = require('./lib/commands/join-private');

const { joinPrivateAction } = require('./lib/buttons/join-private/index');

// Initializes your app with your bot token and app token
const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    stateSecret: 'my-secret',
    scopes: ['chat:write', 'commands', 'groups:read'],
    installationStore: redisStore,
});

app.command('/admin', admin);
app.command('/help?', help);
app.command('/list-private', listPrivate);
app.command('/join-private', joinPrivate);

app.action({callback_id: 'join-private'}, joinPrivateAction);

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();
