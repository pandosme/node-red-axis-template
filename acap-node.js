const HTTP_Digest = require('./HTTP_Digest.js');

module.exports = function(RED) {
	
    function ACAP_Node(config) {
		RED.nodes.createNode(this,config);
		this.account = config.account;
		this.address = config.address;
		this.action = config.action;
		this.data = config.data;
		var node = this;
		node.on('input', function(msg) {
			var account = RED.nodes.getNode(node.account);
			var address = msg.address || node.address;
			var action = msg.action || node.action;
			var data = node.data || msg.payload;
			
			var device = {
				url: account.protocol + '://' + address,
				user: msg.user || account.name,
				password: msg.password || account.credentials.password
			}
			if( !device.user || device.user.length < 2){
				msg.error = true;
				msg.payload = "Invalid user account name";
				node.warn(msg.payload);
				node.send(msg);
				return;
			}
			if( !device.password || device.password.length < 2){
				msg.error = true;
				msg.payload = "Invalid account password";
				node.warn(msg.payload);
				node.send(msg);
				return;
			}
			if( !device.url || device.url.length < 3) {
				msg.error = true;
				msg.payload = "Invalid device address";
				node.warn(msg.payload);
				node.send(msg);
				return;
			}
			msg.error = false;
			switch( action ) {
				case "Settings":
					HTTP_Digest.Get( device, "/local/publisher/settings", "json", function( error, json ) {
						msg.error = error;
						msg.payload = json;
						if(error)
							node.warn(error);
						var data = JSON.parse(json);
						if(!data)
							msg.error = "Parse Error";
						else
							msg.payload = data;
						node.send(msg);
					});
				break;
				case "Request 2":
					msg.topic = "axis-node/request2";
					msg.payload = "TBD";
					node.send(msg);
				break;
			}
        });
    }
	
    RED.nodes.registerType("acap-node",ACAP_Node,{
		defaults: {
            name: {type:"text"},
			account: {type:"axis-config"},
			address: {type:"text"},
			action: { type:"text" },
			data: {type: "text"}
		}		
	});
}
