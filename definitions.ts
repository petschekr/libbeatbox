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
	albumArtURL: string;
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