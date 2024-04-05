const admin = async ({command, client, ack, respond}) => {
  // Acknowledge command request
  await ack();

  // Notify #admin
  const chan = (command.channel_name === 'directmessage')
      ? 'a DM'
      : (command.channel_name) === 'privategroup'
          ? 'a private channel'
          : `<#${command.channel_id}>`
  const messageText = `Message from <@${command.user_id}> in ${chan}: \n\n${command.text}`;

  await client.chat.postMessage({
    channel: 'admin',
    text: messageText,
  })

  // Respond to reporter
  respond('Admins have been notified. They will respond as soon as possible.')
}

module.exports = {admin};
