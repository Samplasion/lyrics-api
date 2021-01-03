import { PartialSong, Song } from './types';

/**
 * The base Provider class. Extend this class
 * to create new Providers.
 *
 * A provider is a class that returns Song objects
 * by fetching a website.
 *
 * @export
 * @class Provider
 */
export default class Provider {
    /**
     * Override this method to implement
     * searching within the website.
     *
     * @memberof Provider
     */
    async search(_query: string): Promise<PartialSong[]> {
        throw new Error('Unimplemented.');
    }

    /**
     * Override this method to implement
     * getting lyrics from the site.
     *
     * @memberof Provider
     */
    async lyrics(_song: PartialSong): Promise<Song> {
        throw new Error('Unimplemented.');
    }
}
