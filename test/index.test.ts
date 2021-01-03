import { API, AZLyricsProvider, BaseProvider, GeniusProvider, PartialSong } from '../src';
import InvalidProvider from './InvalidProvider';

const geniusProv = new GeniusProvider(),
      baseProv = new BaseProvider(),
      azLyricsProv = new AZLyricsProvider();

describe('Base Provider class', () => {
    it('should throw errors for unimplemented methods', () => {
        expect(async () => await baseProv.search('')).rejects.toThrow();
        expect(
            async () => await baseProv.lyrics({} as PartialSong)
        ).rejects.toThrow();
    });

    it('should add privileged providers to the start of the list', () => {
        const api = new API().useProvider(geniusProv);
        expect(api.usePrivilegedProvider(azLyricsProv).usePrivilegedProviders([geniusProv, baseProv]).providers).toEqual<BaseProvider[]>([
            geniusProv,
            baseProv,
            azLyricsProv,
            geniusProv,
        ]);
    });

    it('should return an empty array if there are no providers', () => {
        const api = new API();
        expect(api.getSongs("")).resolves.toEqual([]);
    })

    it('should loop through the do-while', async () => {
        const api = new API()
            .useProviders([
                new InvalidProvider(),
                geniusProv
            ]);
        const prom = await api.getSongs("get lucky").then(s => s[0].lyrics);
        expect(prom).toMatch(/get lucky/i);
    })
});
