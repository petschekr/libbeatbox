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
interface Artist {
	// As returned by the playmusic API
	kind: string;
	name: string;
	artistArtRef?: string;
	artistID: string;
	artist_bio_attribution: {
		kind: string;
		source_title: string;
		source_url: string;
		license_title: string;
		license_url: string;
	};
}
interface Album {
	// As returned by the playmusic API
	kind: string;
	name: string;
	albumArtist: string;
	albumArtRef: string;
	albumId: string;
	artist: string;
	artistId: string[];
	description_attribution: {
		kind: string;
		source_title: string;
		source_url: string;
		license_title: string;
		license_url: string;
	};
	year: number;
}
interface Track {
	// As returned by the playmusic API
	kind: string;
	lastModifiedTimestamp: string;
	title: string;
	artist: string;
	composer: string; // Normally empty
	album: string;
	albumArtist: string;
	year: number;
	trackNumber: number;
	genre: string;
	durationMillis: string; // String containing a number
	albumArtRef: {
		url: string;
	}[];
	playCount: number;
	discNumber: number;
	estimatedSize: string; // String containing a number
	trackType: string; // String containing a number
	storeId: string;
	albumId: string;
	artistId: string[];
	nid: string;
	trackAvailableForSubscription: boolean;
	trackAvailableForPurchase: boolean;
	albumAvailableForPurchase: boolean;
	contentType: string; // String containing a number
	primaryVideo: {
		kind: string;
		id: string;
		thumbnails: {
			url: string;
			width: number;
			height: number;
		}[];
	};
}


class Beatbox {
	private pm: any;
	
	public queue: QueueItem[] = [];
	public playedQueue: QueueItem[] = [];
	public loggedIn: boolean = false;

	constructor() {
		if (!Promise) {
			throw new Error("libbeatbox requires an ES6 environment with promises enabled. Please upgrade to a newer version of Node.js or use io.js");
		}
		this.pm = new PlayMusic();
	}
	public login (email: string, password: string) {
		return new Promise((resolve: PromiseResolve, reject: PromiseReject) => {
			this.pm.init({email: email, password: password}, (err: Error) => {
    			if (err) {
					this.loggedIn = false;
					reject(err);
				}
				else {
					this.loggedIn = true;
					resolve();
				}
			});
		});
	}
	public search (query: string, maxResults?: number) {
		if (!maxResults) {
			maxResults = 1;
		}
		return new Promise((resolve: PromiseResolve, reject: PromiseReject) => {
			this.pm.search(query, maxResults, (err: Error, data: any) => {
				if (err) {
					reject(err);
					return;
				}
				var artists: Artist[] = [];
				var albums: Album[] = [];
				var tracks: Track[] = [];
				if (!data.entries) {
					reject(new Error("No results found"));
					return;
				}
				data.entries.forEach((entry) => {
					switch (entry.type) {
						case "2":
							artists.push(entry.artist);
							break;
						case "3":
							albums.push(entry.album);
							break;
						case "1":
							tracks.push(entry.track);
							break;
					}
				});
				resolve({
					artists: artists,
					albums: albums,
					tracks: tracks
				});
			});
		});
	}
	public searchTrack (query: string) {
		return new Promise((resolve: PromiseResolve, reject: PromiseReject) => {
			this.pm.search(query, 1, (err: Error, data: any) => {
				if (err) {
					reject(err);
					return;
				}
				var track: Track = null;
				for (let i = 0; i < data.entries.length; i++) {
					if (data.entries[i].type === "1") {
						track = data.entries[i].track;
						break;
					}
				}
				if (track === null) {
					reject(new Error("No results found"));
					return;
				}
				resolve(track);
			});
		});
	}
}

export = Beatbox;