# lyrics-api

A modular, extensible, provider-based lyrics searching/scraping service.

`lyrics-api` is based on providers. There are two available out of the box, `GeniusProvider`
and `AZLyricsProvider`.

To add a provider to the API, call `addProvider` or `addProviders` on the API instance:

```ts
import { API, GeniusProvider, AZLyricsProvider } from "lyrics-api";

const api = new API()
    .useProviders([
        // The Genius key is used for searching songs, but it's not required
        new GeniusProvider(process.env.GENIUS_KEY),
        new AZLyricsProvider()
    ]);

// In an async environment
const songs = await api.getSongs("all of me john legend");
```

You can also create your own providers: suppose you have a website, _mylyricswebsite.com_.
You can create a provider that scrapes that website:

```ts
// Other imports...
import { BaseProvider } from "lyrics-api";

export default class MyLyricsProvider extends BaseProvider {
    public async search(query: string) {
        const body = await phin({
            url: `https://mylyricswebsite.com/search?q=${encodeURIComponent(query)}`,
        }).then(res => res.body.toString());
        const $ = cheerio.load(body);
        // Get the returned song count
        const length = parseInt($(".song-count").text());
        // Create an array with the relevant songs
        return Array.from({ length })
            .map((_never, i) => {
                // Get the nth result (0-indexed)
                const row = $(".search-result").eq(i);
                return {
                    title: row.find(".title").text(),
                    artist: row.find(".artist").text(),
                    url: row.find("a").attr("href")
                }
            })
    }

    async lyrics(song: PartialSong): Promise<Song> {
        const body = await phin({
            url: song.url,
        }).then(res => res.body.toString());
        const $ = cheerio.load(body);

        return {
            artist: $(".artist").text(),
            lyrics: $(".lyrics").text(),
            thumbnail: $(".song-image").attr("src"),
            title: $(".song-title").text(),
            url: song.url,
        };
    }
}
```

(Of course, adjust the values to reflect your website.)
Then, to add it and use it as a provider, add it on the API:

```ts
// To add it as a backup provider
API.useProvider(MyLyricsProvider);

// To add it as the first provider used
API.usePrivilegedProvider(MyLyricsProvider);
```

Feel free to upload your Providers to npm so that other users can enjoy them.

The module also exports an `apiInstance` variable that contains an API instance with
the providers already added, with no parameters, in the following order:

1. `GeniusProvider`
2. `AZLyricsProvider`
   
You can use it for a one-off search when all you care for is the lyrics of the song
you're looking for.