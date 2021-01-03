import { BaseProvider, PartialSong, Song } from "../src";

export default class InvalidProvider extends BaseProvider {
    search(_q: string) {
        return Promise.resolve(null);
    }

    lyrics(_q: PartialSong) {
        return Promise.resolve(null as unknown as Song);
    }
}