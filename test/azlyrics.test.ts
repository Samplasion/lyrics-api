import { API, AZLyricsProvider } from '../src/index';

const api = new API().useProvider(new AZLyricsProvider());
const query = 'where are you now britney spear';

describe('AZLyrics results', () => {
    it('should return valid results', async () => {
        const songs = await api.getSongs(query).catch(console.error);
        if (!songs) throw new Error('No songs found');
        expect(songs[0].artist).toMatch(/Britney Spears/);
        expect(songs[0].lyrics).toMatch(
            /Where are you now, what have you found/
        );
        expect(songs[0].provider).toMatch('AZLyrics');
    });

    it("shouldn't return Spotify-related results", async () => {
        const songs = await api.getSongs(query);
        expect(songs.map(song => song.artist)).not.toContain('Spotify');
    });
});
