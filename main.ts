/// <reference path="typescript_defs/node.d.ts" />
/// <reference path="typescript_defs/bluebird.d.ts" />

var Bluebird = require("bluebird");
var PlayMusic = require("playmusic");

interface QueueItem {
	id: {
		track: string;
		album: string;
		artist: string;
	};
	title: string;
	album: string;
	artist: string;
	genre?: string;
	info?: {
		duration: number;
		formattedDuration: string;
		year?: number;
		trackNumber?: number;
	}
}

class Beatbox {
	private pm: any;
	public queue: QueueItem[] = [];

	constructor() {
		this.pm = Bluebird.promisifyAll(new PlayMusic());
	}
	login(email: string, password: string, callback?: (err: Error) => any) {
		return pm.initAsync({"email": email, "password": password}).nodeify(callback);
	}
}