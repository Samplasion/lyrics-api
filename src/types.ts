/**
 * Represent a song without its lyrics.
 * 
 * This interface won't be particularly useful
 * if you just want the lyrics, but if you're adding
 * a new provider, this is what you'll need to return
 * after searching and what you'll get when fetching
 * lyrics.
 */
export interface PartialSong {
    artist: string;
    title: string;
    url: string;
}

/**
 * Represents a song.
 * 
 * Represents a song complete of lyrics and (if applicable) a thumbnail.
 */
export interface Song extends PartialSong {
    lyrics: string;
    thumbnail: string;
}