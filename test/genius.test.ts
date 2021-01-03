import { API, GeniusProvider } from '../src/index';
import { GENIUS } from './config';

const api = new API().useProvider(new GeniusProvider());
const query = 'where are you now britney spear';

describe('Genius results (no API key)', () => {
    it('should return valid results', async () => {
        const songs = await api.getSongs(query).catch(console.error);
        if (!songs) throw new Error('No songs found');
        expect(songs[0].artist).toMatch(/Britney Spears/);
        expect(songs[0].lyrics).toMatch(
            /Where are you now, what have you found/
        );
        expect(songs[0].provider).toMatch('Genius');
    });

    it("shouldn't return Spotify-related results", async () => {
        const songs = await api.getSongs(query);
        expect(songs.map(song => song.artist)).not.toContain('Spotify');
    });
});

if (GENIUS) {
    describe('Genius results (with API key)', () => {
        api.providers[0] = new GeniusProvider(GENIUS);
        it('should return valid results', async () => {
            const songs = await api.getSongs(query).catch(console.error);
            if (!songs) throw new Error('No songs found');
            expect(songs[0].lyrics).toMatch(
                /Where is your heart when I'm not around/
            );
            expect(songs[0].provider).toMatch('Genius');
        });

        it("shouldn't return Spotify-related results", async () => {
            const songs = await api.getSongs(query);
            expect(songs.map(song => song.artist)).not.toContain('Spotify');
        });
    });
}