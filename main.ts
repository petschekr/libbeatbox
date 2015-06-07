/// <reference path="typescript_defs/node.d.ts" />

var PlayMusic = require("playmusic");

type PromiseResolve = (value?: any) => any;
type PromiseReject = (reason: Error) => any;
declare var Promise: any;

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
		if (!Promise) {
			throw new Error("libbeatbox requires an ES6 environment with promises enabled. Please upgrade to a newer version of Node.js or use io.js");
		}
		this.pm = new PlayMusic();
	}
	login (email: string, password: string) {
		return new Promise((resolve: PromiseResolve, reject: PromiseReject) => {
			this.pm.init({email: email, password: password}, function (err: Error) {
    			if (err) {
					reject(err);
				}
				else {
					resolve();
				}
			});
		});
	}
}

export = Beatbox;