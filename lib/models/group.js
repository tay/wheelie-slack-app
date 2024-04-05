'use strict'

const Team = require('../models/team')
const bluebird = require('bluebird')

// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient } = require("@slack/web-api");

module.exports.get = function (team, filter) {
  filter = filter || /.*/
  let teamP
  if (typeof team === 'string') {
    teamP = Team.get(team)
  } else {
    teamP = bluebird.resolve(team)
  }

  return teamP.then(async team => {
    const token = team.bot.bot_access_token

    const client = new WebClient(team.bot.bot_access_token);

    const conversations = await client.conversations.list({
      types: 'private_channel',
      exclude_archived: true,
      limit: 100,
    });

    const channels = conversations.channels.filter(g => (
        (g.name.match(filter) || `#${g.name}`.match(filter) || g.purpose.value.match(filter)) &&
        !g.name.match(/^admin/i) &&
        !g.purpose.value.match(/\[secret\]/gi)
    ));

    const memberPopulatedChannelsP = await channels.map(async (g) => {
      // note: not paginated
      const res = await client.conversations.members({
        token,
        channel: g.id
      });

      g.members = res.members;
      return g;
    });

    return Promise.all(memberPopulatedChannelsP);
  })
}
