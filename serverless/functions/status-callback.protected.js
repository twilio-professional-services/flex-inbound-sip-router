const { getRoute } = require(Runtime.getFunctions()["common/helpers/get-route"].path);

exports.handler = (context, event, callback) => {
  if (!event.AccountSid || !event.To || event.Direction !== "inbound") {
    return callback(null);
  }

  const route = getRoute(event.To);

  if (
    route.type === "webhook" &&
    route.destination.startsWith(`https://webhooks.twilio.com/v1/Accounts/${event.AccountSid}/Flows/FW`)
  ) {
    // Redirect Studio flow routes to the Studio webhook to prevent stuck executions
    const response = new Twilio.Response();
    response.setStatusCode(302);
    response.appendHeader("Location", route.destination);
    return callback(null, response);
  }

  return callback(null);
};
