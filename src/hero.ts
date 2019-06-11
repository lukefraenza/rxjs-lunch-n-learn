import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

    export type Hero = {
        id: number,
        name: string,
        type: 'animal'|'vegetable'|'mineral'
    };

const quail: Hero = {id: 0, name: 'Quail man', type: 'animal'};
const batman: Hero = {id: 1, name: 'Batman', type: 'animal'};
const thing: Hero = {id: 2, name: 'The Thing', type: 'mineral'};
const celeryMan: Hero = {id: 3, name: 'Celeryman', type: 'vegetable'};
const heroes: Hero[] = [ quail, batman, thing, celeryMan ];


export class HeroService {

    getHero(id?: number): Observable<Hero> {
        if(id != null && id >= 0 && id <4) {
            return of(heroes[id]).pipe(delay(2000));
        }
        return of(quail).pipe(delay(1000));
    };

    getHeroes(): Observable<Hero[]> {
        return of(heroes).pipe(delay(3000));
    };
};