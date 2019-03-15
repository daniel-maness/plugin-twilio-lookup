exports.handler = async function(context, event, callback) {
	const got = require("got");

	const client = context.getTwilioClient();

	const response = new Twilio.Response();
	const fromNumber = event.FromNumber;
	const addOnName = 'whitepages_pro_caller_id';

	try {
		const result = await client.lookups.phoneNumbers(fromNumber)
																			 .fetch({addOns:addOnName});
		if (result.addOns.status === 'successful') {
			response.setStatusCode(201);
			response.setBody(result.addOns.results[addOnName]);
		} else {
			response.setStatusCode(400);
		}
	} catch (error) {
		console.log(error);
		response.setStatusCode(500);
		callback(error);
	}

	response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET");
  response.appendHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept");
  response.appendHeader("Content-Type", "application/json");

  callback(null, response);
}