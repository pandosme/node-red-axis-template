//Copyright (c) 2023 Fred Juhlin
const HTTP_digest = require('./axis-digest');

module.exports = function(RED) {
	
    function AXIS_Template(config) {
		RED.nodes.createNode(this,config);
		this.preset = config.preset;		
		this.action = config.action;
		this.data = config.data;
		this.options = config.options;
		var node = this;
		
		node.on('input', function(msg) {
			node.status({});
			var device = {address: null,user: null,password: null,protocol: "http"}

			var preset = RED.nodes.getNode(node.preset);
			var device = {
				address: msg.address || preset.address,
				user: msg.user || preset.credentials.user,
				password: msg.password || preset.credentials.password,
				protocol: preset.protocol || "http"
			}
			
			var action = msg.action || node.action;
			var filename = msg.filename || node.filename;
			var options = node.options || msg.payload;

			switch( action ) {
				case "Get":
/*				
					HTTP_digest.get( device, msg.payload, function( error, response ) {
						msg.payload = response;
						if( error ) {
							node.error(response.statusMessage, msg);
							return;							
						}
						node.send(msg);
					});
				break;
				case "Set":
					HTTP_digest.get( device, msg.payload, function( error, response ) {
						msg.payload = response;
						if( error ) {
							node.error(response.statusMessage, msg);
							return;							
						}
						node.send(msg);
					});
*/					
				break;
			}
        });
    }
	
    RED.nodes.registerType("Axis Template",AXIS_Template,{
		defaults: {
			preset: {type:"Axis Device"},
			action: { type:"text" },
			data: { type:"data" },
			options: { type:"text" }
		}		
	});
}
