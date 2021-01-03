import Provider from "../Provider";
import phin from "phin";
import { PartialSong, Song } from "../types";
import cheerio from "cheerio";

const host = "https://genius.com";
const searchRegex = /(.+(?= – )) – (.+(?=\|\/))\|(.+(?=\|))\|(\d+)/i;
const searchHeaders = {
    Referrer: host,
    Host: 'genius.com',
    Accept: 'application/x-javascript, text/javascript, text/html, application/xml, text/xml, */*',
};

export interface GeniusAPIResults {
    response: {
        hits: {
            result: {
                title: string,
                url: string,
                primary_artist: {
                    name: string,
                }
            }
        }[]
    }
}

/**
 * Provides song data from Genius.com.
 *
 * @export
 * @class GeniusProvider
 * @extends {Provider}
 */
export default class GeniusProvider extends Provider {
    private apiKey?: string;

    /**
     * Creates an Genius provider.
     * 
     * The API key is 100% optional and it's only used for searching.
     */
    constructor(apiKey?: string) {
        super();

        this.apiKey = apiKey;
    };

    public async search(query: string) {
        if (this.apiKey) {
            return this.apiSearch(query);
        } else {
            return this.peasantSearch(query);
        }
    }

    private async apiSearch(query: string): Promise<PartialSong[]> {
        const body = await phin({
            url: `https://api.genius.com/search?q=${encodeURIComponent(query)}`,
            parse: "json",
            headers: {
                Authorization: `Bearer ${this.apiKey}`
            }
        }).then(res => res.body as GeniusAPIResults);
    
        return body.response.hits.map<PartialSong>(obj => ({
            artist: obj.result.primary_artist.name,
            title: obj.result.title,
            url: obj.result.url
        }));
    }

    private async peasantSearch(query: string): Promise<PartialSong[]> {
        const body = await phin({
            url: `${host}/search/quick?&q=${encodeURIComponent(query)}`,
            headers: searchHeaders
        }).then(res => res.body.toString());
        const songs = (body.split("\n").map(line => searchRegex.exec(line))
            .filter(val => val) as unknown as [string, string, string, string, string])
            .map(([_, artist, title, url]) => {
                return {
                    artist,
                    title,
                    url: host + url
                }
            });
        return songs;
    }

    async lyrics(song: PartialSong, firstTime = true): Promise<Song> {
        const body = await phin(song.url).then(res => res.body.toString());
        const $ = cheerio.load(body);

        const artist = $("h2").first().text().trim()
            , lyrics = $(".lyrics").first().text().trim()
            , thumbnail = $(".cover_art-image").first().attr("src");

        if (!(artist && lyrics && thumbnail)) {
            return firstTime ? this.lyrics(song, false) : {
                artist: null as unknown as string,
                lyrics: null as unknown as string,
                thumbnail: null as unknown as string,
                title: null as unknown as string,
                url: null as unknown as string
            };
        }

        return {
            artist,
            lyrics,
            thumbnail,
            title: $("h1").first().text().trim(),
            url: song.url,
        };
    }
}