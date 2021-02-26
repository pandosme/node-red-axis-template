const AxisDigest = require('./AxisDigest.js');

module.exports = function(RED) {
	
    function AXIS_Template(config) {
		RED.nodes.createNode(this,config);
		this.preset = config.preset;		
		this.action = config.action;
		this.data = config.data;
		this.options = config.options;
		var node = this;
		
		node.on('input', function(msg) {
			var address = null;
			var user = null;
			var password = null;
			var protocol = "http";
			var preset = RED.nodes.getNode(node.preset);

			node.status({});

			if( preset ) {
				address = preset.address;
				user = preset.credentials.user;
				password = preset.credentials.password;
				protocol = preset.protocol || "http";
			}
			
			if( msg.address )
				address = msg.address;
			if(!address || address.length < 3) {
				msg.error = "Address undefined";
				node.warn(msg.error);
				return;
			}
			
			if( msg.user )	user = msg.user;
			if(!user || user.length < 2) {
				msg.error = "User name undefined";
				node.warn(msg.error);
				return;
			}
			
			if( msg.password )
				password = msg.password;
			if(!password || password.length < 3) {
				msg.error = "Password undefined";
				node.warn(msg.error);
				return;
			}

			var device = {
				url: protocol + '://' + address,
				user: user,
				password: password
			}

			var action = msg.action || node.action;
			var data = node.data || msg.payload;
			var data = node.options || msg.options;

			switch( action ) {
				case "Get":
					msg.payload = {
						action: action,
						data: data,
						options: options
					}
					node.warn("Not yet implemented");
					node.send(msg);
				break;
				case "Set":
					msg.payload = {
						action: action,
						data: data,
						options: options
					}
					node.warn("Not yet implemented");
					node.send(msg);
				break;
			}
        });
    }
	
    RED.nodes.registerType("axis-template",AXIS_Template,{
		defaults: {
			preset: {type:"axis-preset"},
			action: { type:"text" },
			data: { type:"data" },
			options: { type:"text" }
		}		
	});
}
