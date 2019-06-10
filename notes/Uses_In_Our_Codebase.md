
# Uses in our Code Base

- A lot (but not all) of the examples of RxJS in our code base have to do with getting data from our API

## API/SDK

### Basic Data Retrieval

- Every function in our SDK which calls our API returns the data as an Observable, so we encounter them quite often.
- For most of our history of using Observables, we did not take advantage of much of the power that comes with RxJS
  - `Observable` has a `.toPromise()` method, so we would often just append `.toPromise()` to the end of our SDK function call and handle the response as a Promise

#### Example:
```TypeScript
/** manage-place.service.ts */
public async getPlaceTypes(): Promise<PlaceType[]> {
  let placeTypes: PlaceTypeResponse[] = await this.placeService.getPlaceTypes(`structure equals '0'`).toPromise();
  let types: PlaceType[] = placeTypes.map(type => {
    return this.processPlaceType(type);
  });
  return sortByIgnoreCase(types, ['label']);
}
```

### Searching via the API

- It is quite common for our forms to contain a combobox where the user must choose from one of many options, say, Parent Place
- While we _could_ block the form load while we get all the potential options, we have the potential to be downloading hundreds if not thousands of places, which would:
  1. take a long time to download, consisting of many repeated calls to the API, and
  2. slow down our form considerably as it tracks and renders massive amounts of data
  3. be slow to search since it would all be in-memory on the client side
- Instead, we commonly follow the pattern where we initially download the first 250 options, and give the user the ability to search
  - as the user types in the combobox, we send their text to the API, and repopulate the combobox dropdown with the first 250 places that match the user search text

#### Imagine implementing this without RxJS...
We would need to:
- have a callback function that is called for every keystroke
- Call the API for every keystroke, or set up a `timeout` to call it after so many milliseconds
- await the response,
- but if the user types more while we're waiting, we'd have to send another API request, but **you can't cancel a Promise**
- so now we have _two_ API calls in-flight, and _two_ Promises we're awaiting,
- and we need to know to ignore the first promise results somehow,
- and what if the user types some more, now we have _three_ API calls that could return in _any_ order
- and now the user has closed the form in disgust and we're still calling those APIs in the background and it's just a nightmare.

#### OR, we could use RxJS and get use something like this

```HTML
<ec-combobox id="parent"
  <!-- ... -->
  (search)="onParentPlaceSearch($event)">
</ec-combobox>
```

```TypeScript

// receives search text from the comobox and pushes to any subscribers
private parentPlaceSearcher: Subject<string> = new Subject<string>();

// when the combobox emits search text, pass it on to our Subject
public onParentPlaceSearch(searchText: string): void {
  this.parentPlaceSearcher.next(searchText);
}

private setUpSubscriptions(): void {
  this.parentPlaceSearcher.pipe(
    debounceTime(300),                       // wait until user has stopped input for 300 ms
    takeUntil(this.destroyed),               // stop listening when the user leaves the page
    distinctUntilChanged(),                  // don't do anything if the user typed and the end result was the same search text
    switchMap((searchText: string) => {      // call the API with the search text (cancelling any in-progress calls)
      return this.managePlaceService.getParentPlaces(this.buildingId, searchText);
    })
  ).subscribe((result: PlacesWithCount) => {      // populate combobox with API results
    this.formData.parentPlaces = result.places;
    this.formData.parentPlaceCount = result.count;
  });
  //...
}
```

Operators are wonderful things.