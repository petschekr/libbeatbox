/// <reference path="typescript_defs/node.d.ts" />
/// <reference path="definitions.ts" />

class Queue {
	public played: QueueItem[];
	public playing: QueueItem;
	public next: QueueItem[];
	
	constructor() {
		this.clear(true);
	}
	add (item: QueueItem): void {
		if (!this.playing) {
			this.playing = item;
		}
		else {
			this.next.push(item);
		}
	}
	remove (id: string): boolean {
		for (let i = 0; i < this.next.length; i++) {
			if (this.next[0].id.track === id) {
				this.next.splice(i, 1);
				return true;
			}
		}
		return false;
	}
	clear (clearPlayed: boolean = false) {
		if (clearPlayed) {
			this.played = [];
		}
		this.playing = null;
		this.next = [];
	}
	advance (): QueueItem {
		this.played.push(this.playing);
		if (this.next.length < 1) {
			this.playing = null;
			return null;
		}
		this.playing = this.next.shift();
		return this.playing;
	}
	rewind (): QueueItem {
		this.next.unshift(this.playing);
		if (this.played.length < 1) {
			this.playing = null;
			return null;
		}
		this.playing = this.played.pop();
		return this.playing;
	}
}
export = Queue;