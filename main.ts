/// <reference path="typescript_defs/node.d.ts" />
/// <reference path="definitions.ts" />

var PlayMusic = require("playmusic");
import Queue = require("./queue");

class Beatbox {
	public pm: any;
	public queue: Queue;
	public loggedIn: boolean = false;

	constructor() {
		if (!Promise) {
			throw new Error("libbeatbox requires an ES6 environment with promises enabled. Please upgrade to a newer version of Node.js or use io.js");
		}
		this.pm = new PlayMusic();
		this.queue = new Queue();
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
	public search (query: string, maxResults: number = 1) {
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
	public getStreamUrl (id: string) {
		return new Promise((resolve: PromiseResolve, reject: PromiseReject) => {
			this.pm.getStreamUrl(id, (err: Error, data: any) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(data);
			});
		});
	}
	public idToQueueItem (id: string) {
		return new Promise((resolve: PromiseResolve, reject: PromiseReject) => {
			this.pm.getAllAccessTrack(id, (err: Error, data: any) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(this.trackToQueueItem(data));
			});
		});
	}
	public trackToQueueItem (track: Track): QueueItem {
		var duration: number = parseInt(track.durationMillis, 10) / 1000;
		var minutes: number = Math.floor(duration / 60);
		var seconds: number = duration % 60;
		var durationFormatted: string = `${minutes}:${seconds.toString().length === 1 ? "0" + seconds : seconds}`;
		var queueItem = {
			id: {
				track: track.nid,
				album: track.albumId,
				artist: track.artistId[0]
			},
			title: track.title,
			album: track.album,
			albumArtURL: track.albumArtRef[0].url,
			artist: track.artist,
			genre: track.genre,
			info: {
				duration: duration,
				formattedDuration: durationFormatted,
				year: track.year,
				trackNumber: track.trackNumber 
			}
		}
		return queueItem;
	}
	public createRadioStation (stationName: string, seedID: string, seedType: string) {
		return new Promise((resolve: PromiseResolve, reject: PromiseReject) => {
			this.pm.createStation(stationName, seedID, seedType, (err: Error, data: any) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(data.mutate_response[0].id);
			});
		});
	}
	public queueRadioStationTracks (stationID: string, numberOfTracks: number = 5) {
		return new Promise((resolve: PromiseResolve, reject: PromiseReject) => {
			this.pm.getStationTracks(stationID, numberOfTracks, (err: Error, data: any) => {
				if (err) {
					reject(err);
					return;
				}
				var tracks: Track[] = data.data.stations[0].tracks;
				tracks.forEach((track: Track) => {
					this.queue.add(this.trackToQueueItem(track));
				});
				resolve();
			});
		});
	}
	private incrementTrackPlaycount (trackID: string) {
		return new Promise((resolve: PromiseResolve, reject: PromiseReject) => {
			this.pm.incrementTrackPlaycount(trackID, (err: Error, data: any) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}
	public play (trackID: string) {
		return this.incrementTrackPlaycount(trackID)
			.then(() => {
				return this.getStreamUrl(trackID);
			});
	}
}

export = Beatbox;