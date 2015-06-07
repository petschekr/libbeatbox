/// <reference path="typescript_defs/node.d.ts" />
/// <reference path="typescript_defs/bluebird.d.ts" />

var Bluebird = require("bluebird");
var PlayMusic = require("playmusic");

function noErrorPromisifier(originalMethod) {
	return function promisified() {
		var args = [].slice.call(arguments);
		var self = this;
		return new Promise(function (resolve,reject) {
			args.push(resolve); 
			originalMethod.apply(self,args);
		});
	};
}

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
		this.pm = Promise.promisifyAll(new PlayMusic(), {promisifier: noErrorPromisifier});
	}
	login(email: string, password: string, callback?: (err: Error) => any) {
		return pm.initAsync({"email": email, "password": password}).nodeify(callback);
	}
}