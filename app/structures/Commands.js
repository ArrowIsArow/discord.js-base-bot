module.exports = class Commands {

	constructor(client) {
		this.client = client;

		this.name = String;
		this.description = String;
		this.options = Array;

		this.category = String;

		this.enabled = Boolean;
		this.ignoreSlash = Boolean;
	}

};
