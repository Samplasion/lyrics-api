import API from "./API";
import AZLyricsProvider from "./providers/AZLyricsProvider";
import GeniusProvider from "./providers/GeniusProvider";
import BaseProvider from "./Provider";
import { PartialSong, Song } from "./types";

const api = new API()
    .useProviders([ new GeniusProvider(), new AZLyricsProvider() ]);

export {
    API,
    api as apiInstance,
    GeniusProvider,
    AZLyricsProvider,
    BaseProvider,
    PartialSong,
    Song
};