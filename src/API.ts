import Provider from "./Provider";
import { PartialSong } from "./types";

/**
 * The main API.
 * 
 * To utilize the API, you must create providers.
 * A provider is a class that returns Song objects
 * by fetching a website.
 * 
 * @example
 * ```js
 * import { API, GeniusProvider, AZLyricsProvider } from "lyrics-api";
 * 
 * const api = new API()
 *     .useProviders([
 *         // The Genius key is used for searching songs, but it's not required
 *         new GeniusProvider(process.env.GENIUS_KEY),
 *         new AZLyricsProvider()
 *     ]);
 * 
 * // In an async environment
 * const songs = await api.getSongs("all of me john legend");
 * ```
 */
export default class API {
    constructor() {}

    providers: Provider[] = [];

    /**
     * Adds a provider to the list of available providers.
     *
     * @param {Provider} provider
     * @returns {this}
     * @memberof API
     */
    public useProvider(provider: Provider): this {
        this.providers.push(provider);
        return this;
    }

    /**
     * Adds multiple providers to the list of available providers.
     *
     * @param {Provider[]} providers
     * @returns {this}
     * @memberof API
     */
    public useProviders(providers: Provider[]): this {
        this.providers = this.providers.concat(providers);
        return this;
    }

    /**
     * Adds a provider to the start of the list of available providers.
     *
     * @param {Provider} provider
     * @returns {this}
     * @memberof API
     */
    public usePrivilegedProvider(provider: Provider): this {
        this.providers.unshift(provider);
        return this;
    }

    /**
     * Adds multiple providers to the start of the list of available providers.
     *
     * @param {Provider[]} providers
     * @returns {this}
     * @memberof API
     */
    public usePrivilegedProviders(providers: Provider[]): this {
        this.providers = providers.concat(this.providers);
        return this;
    }

    /**
     * Returns a list of Songs, with lyrics, that match
     * the query. The songs are fetched using the first
     * available provider that returns valid songs.
     *
     * @param {string} query
     * @returns
     * @memberof API
     */
    public async getSongs(query: string) {
        let songs: PartialSong[] | null = null;
        let index = -1;
        do {
            try {
                songs = await this.providers[++index].search(query);
            } catch {}
        } while (!songs?.length && index < this.providers.length);
        if (!songs?.length)
            return [];
        return Promise.all(songs.map(song => this.providers[index].lyrics(song)));
    }
}