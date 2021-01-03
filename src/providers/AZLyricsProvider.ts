import Provider from "../Provider";
import phin from "phin";
import { PartialSong, Song } from "../types";
import cheerio from "cheerio";

/**
 * Provides song data from AZLyrics.com
 *
 * @export
 * @class AZLyricsProvider
 * @extends {Provider}
 */
export default class AZLyricsProvider extends Provider {
    public async search(query: string) {
        const body = await phin({
            url: `https://search.azlyrics.com/search.php?q=${encodeURIComponent(query)}`,
        }).then(res => res.body.toString());
        const $ = cheerio.load(body);
        const length = parseInt($(".panel-heading").first().text().match(/\[1-(\d+) of \d+ found\]/)?.[1] ?? "0");
        return Array.from({ length })
            .map((_never, i) => {
                const row = $("body > div.container.main-page > div > div > div:nth-child(1) > table > tbody > tr").eq(i);
                return {
                    title: row.find("a").text().match(/"(.*)"/)?.[1] ?? "",
                    artist: row.find("td > b").text(),
                    url: row.find("a").attr("href")!
                }
            })
    }

    async lyrics(song: PartialSong): Promise<Song> {
        const body = await phin({
            url: song.url,
        }).then(res => res.body.toString());
        const $ = cheerio.load(body);
        const mainContent = $(".main-page > .row > div");

        return {
            artist: mainContent.find(".lyricsh").text().replace("Lyrics", "").trim(),
            lyrics: mainContent.find("br + br + div").text().trim(),
            thumbnail: "",
            title: mainContent.find(".ringtone + b").text().match(/"(.*)"/)?.[1].trim() ?? "",
            url: song.url,
        };
    }
}