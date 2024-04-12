const helpMessage = `Usage: /<command> <args>

Commands:
  admin <message>                Sends a message to the admin channel
  join-private [channel]         Requests an invite to the given channel
  list-private [filter] [--all]  Lists all available private channels`

const help = async ({ack, respond}) => {
  // Acknowledge command request
  await ack();

  // Respond to user
  respond(helpMessage)
}

module.exports = {help};
