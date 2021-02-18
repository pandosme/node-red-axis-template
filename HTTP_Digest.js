const got = require("got");
const digestAuth = require("@mreal/digest-auth");

var exports = module.exports = {};

exports.Get = function( device, path, resonseType, callback ) {
	var client = got.extend({
		hooks:{
			afterResponse: [
				(res, retry) => {
					const options = res.request.options;
					const digestHeader = res.headers["www-authenticate"];
					if (!digestHeader){
						console.error("Response contains no digest header");
						return res;
					}
					const incomingDigest = digestAuth.ClientDigestAuth.analyze(	digestHeader );
					const digest = digestAuth.ClientDigestAuth.generateProtectionAuth( incomingDigest, device.user, device.password,{
						method: options.method,
						uri: options.url.pathname,
						counter: 1
					});
					options.headers.authorization = digest.raw;
					return retry(options);
				}
			]
		}
	});
	
	(async () => {
		try {
			const response = await client.get( device.url+path,{
				responseType: resonseType,
				https:{rejectUnauthorized: false}
			});
			callback(false, response.body );
		} catch (error) {
			console.log("HTTP GET Error:", error);
			callback(error, error );
		}
	})();

}

exports.Post = function( device, path, body, callback ) {
	var client = got.extend({
		hooks:{
			afterResponse: [
				(res, retry) => {
					const options = res.request.options;
					const digestHeader = res.headers["www-authenticate"];
					if (!digestHeader){
						console.error("Camera Get: Response contains no digest header");
						return res;
					}
					const incomingDigest = digestAuth.ClientDigestAuth.analyze(	digestHeader );
					const digest = digestAuth.ClientDigestAuth.generateProtectionAuth( incomingDigest, device.user, device.password,{
						method: options.method,
						uri: options.url.pathname,
						counter: 1
					});
					options.headers.authorization = digest.raw;
					return retry(options);
				}
			]
		}
	});

	var json = null;
	if( typeof body === "object" )
		json = body;
	if( typeof body === "string" )
		json = json = JSON.parse( body );

	(async () => {
		try {
			var response = null;
			if( json )
				response = await client.post( device.url+path, {
					json: json,
					responseType: 'json',
					https: {rejectUnauthorized: false}
				});
			else
				response = await client.post( device.url+path, {
					body: body,
					https: {rejectUnauthorized: false}
				});
//			console.log("AxisDigest Response", response.body);
			callback(false, response.body );
		} catch (error) {
			console.log("Axis Digest Post" ,error, response.body);
			callback(error, error  );
		}
	})();
}

