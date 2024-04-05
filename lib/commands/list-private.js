const Group = require('../models/group')

function formatChannel (chan, user) {
  const omitCount = chan.purpose.value && chan.purpose.value.match(/\[no\-count\]/g)
  const purpose = chan.purpose.value.replace(/\[[^\]]*\]/g, '')
  const userInChannel = chan.members.find(m => m === user)
  return {
    title: `#${chan.name} [${omitCount ? '?' : chan.members.length - 1}]`,
    text: purpose + (userInChannel ? (purpose ? '\n' : '') + '(Already Joined)' : ''),
    mrkdwn: true,
    callback_id: 'join-private',
    actions: !userInChannel && [{
      name: 'join',
      text: 'Join',
      type: 'button',
      value: chan.id
    }]
  }
}

function displayGroupList (filter, user, groups) {
  return {
    text: `These channels are private to disallow previewing (view without join). Available private channels: `,
    attachments: groups.map(g => formatChannel(g, user))
  }
}

const listPrivate = async ({command, ack, respond}) => {
  await ack();

  const filter = command.filter ? new RegExp(command.filter) : null
  let chans = await Group.get(command.team_id, filter)
  if (command.text !== "--all") {
    chans = chans.filter(c => !c.members.find(m => m === command.user_id));
  }

  if (chans && chans.length) {
    respond(displayGroupList(filter, command.user_id, chans))
  } else {
    respond(filter ? `No channels matching \`${filter}\`` : `No private channels available`)
  }
}

module.exports = {listPrivate};
