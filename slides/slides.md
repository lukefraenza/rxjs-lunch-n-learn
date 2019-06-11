name: inverse

layout: true
class: center, middle, inverse

---

# Introduction to RxJS

> "Every code action has a (not so) equal and opposite reaction." - Abraham Lincoln

---
layout: false

# Agenda

--
1. What is RxJS?

???
First, we'll talk a little bit about what RxJS is, and Reactive Programming in general

--
2. Basic Types

???
Next, we'll go over the main, basic types in RxJS.  You know, the things we're going to work with.

--
3. Pull vs. Push

???
Then, we'll talk about the concepts of pull vs push when it comes to collections and data

--
4. In our codebase

???
After that, I'll show you the two most common ways RxJS is currently used in our codebase

--
5. Exercises

???
We'll follow that up by playing with some reactive code

---

template: inverse

# What is Reactive Programming/RxJS?

???
So... what is Reactive Programming / RxJS?

---
class: middle

> RxJS is a library for composing asynchronous and event-based programs by using observable sequences. It provides one core type, the Observable, satellite types (Observer, Schedulers, Subjects) and operators inspired by Array#extras (map, filter, reduce, every, etc) to allow handling asynchronous events as collections.

> ReactiveX combines the Observer pattern with the Iterator pattern and functional programming with collections to fill the need for an ideal way of managing sequences of events.

[RxJS Introduction](https://rxjs-dev.firebaseapp.com/guide/overview)

???

Here's the super-helpful explanation from the RxJS website.

Clear as mud, right?

---
template: inverse

# Any questions?

???

Let's eat!

---
class: middle, center

# A better definition

> “Reactive programming is programming with asynchronous data streams.” - André Staltz


---
.center[![stream](assets/Urban_stream_in_park.jpg)]

???

An Observable is a stream.  What does that mean?

A stream is a sequence of ongoing events ordered in time.
I'll probably refer to them as Observables and Streams interchangably



---
.center[![stream](assets/Urban_stream_in_park2.jpg)]

???

It can emit three different things: a value (of some type), an error, or a "completed" signal.

---

# Observables vs. Promises

* Similar
* Work well together
* Observables not necessarily `asynchronous`

???

Since the "better" definition has the word "Asynchronous" in it, you might be tempted to think of it like a Promise.

And you wouldn't be _entirely_ wrong.  A Promise is simply an Observable with one single emitted value, where Rx streams allow many returned values.

Promises and Observables work very well together.  There are several operators that will convert one to the other.

Also, Observables don't need to be asynchronous.

---
.center[![stream](assets/Urban_stream_in_park2.jpg)]

???

So Reactive Programming is like sitting by the edge of a stream, and when a value floats up to you,
you _react_ in some way appropriate to what you've been given.
---

# RxJS is
- like writing assembly lines, or pipelines, for your code
- Reusable/Configurable/Asynchronous

---
template: inverse

# Basic types
---

.left-column.top[
# Basic types
## Observable
]
.right-column[
- collection of future values or events
- a _stream_ of data that can arrive over time
  - A stream is a sequence of ongoing events ordered in time.
- can emit three things:
  - a value
  - an error
  - a completion
]
---
.left-column[
# Basic types
## Observable
## Subscription
]
.right-column[
- thing that executes and listens to a (cold) Observable
- thing that starts listening to a (hot) Observable
- the execution of an Observable
- useful for cancelling
]

---

.left-column[
# Basic types
## Observable
## Subscription
## Observer
]
.right-column[
- function you pass to a subscription that contains code that _reacts_ to values pushed from the Observable
- callbacks that know how to listen to observables
]

---

.left-column[
# Basic types
## Observable
## Subscription
## Observer
## Operator
]
.right-column[
- transform the values of the collections/events emitted by the Observable
- "pure" functions
  - do not mutate data passed in
- map, filter, concat, etc
- provide a new observable, which can then be acted upon by another Operator or an Observer
]

---

.left-column[
# Basic types
## Observable
## Subscription
## Observer
## Operator
## Subject
]
.right-column[
- a (hot) Observable _and_ an Observer
  - you can subscribe to it _and_ you can push values into it that will make their way to subscribers
  - you can "prime" it with a starting value
- like an `EventEmitter`
- the only way of multicasting a value or event to multiple Observers.
]

---
template: inverse
# Why pure functions?

---
# Why pure functions?
* predictable

???
- They're predictable; they don't do anything _sneaky_

--
* no mutations

???
- Doesn’t mutate anything - anything you pass to it will remain unscathed

--
* confidence in return values

???
- Always returns the same value based on the same parameters
  - Isn't affected by outside state that may change

--
* no side effects

???
- No side effects. It can’t mutate state outside of the function

---
template: inverse
# Pull vs. Push

???
So now we'll talk about the concepts of Pull and Push

---

## Producer/Consumer

  .pull-left[![producer](assets/keebler.jpg)Producer]
  .pull-right[![consumer](assets/cookie_monster.jpg)Consumer]

???

When writing (useful) code, you often need to work with data given to you from some source,
or provide data to an outside source.

A Producer is a thing that gives you data.

A Consumer is what takes the data and does something with it.

---
# Pull
.center[![pull](assets/are_we_there_yet.jpg)]

---

# Pull

- _Consumer_ determines when it gets data from the Producer
- Producer doesn't know when the data will be delivered

1. Consumer needs some data
2. Consumer asks Producer for data
3. Producer gives data back to Consumer
4. Consumer transforms and uses the data
5. Consumer needs more data
6. `GOTO 2`

---

## Single Value Producer
```TypeScript
function oneValueProducer(a: string): string {
  // ...do stuff...
  return a + '!';
}

/** Consumer */
let aValue = oneValueProducer('foo');
// ... do stuff...
// need to call again to get more data
aValue = oneValueProducer('bar');
// ... do stuff ...
aValue = oneValueProducer('baz');
```

---

## Multiple Value Producer

```TypeScript
let multipleValueProducer = ['foo', 'bar', 'baz'];

/** Consumer */
let aValue = multipleValueProducer[0];
// ... do stuff...
aValue = multipleValueProducer[1];

/** another consumer */
for (const x of foo) {
  // do stuff with x
}
```

---
# Push
.center[![push](assets/gps.png)]
---

# Push
- _Producer_ determines when it gives data to the Consumer
- Consumer doesn't know when the data will be delivered

1. Consumer knows it will need some data
2. Consumer subscribes to Producer
3. Producer gets data and sends it to Consumer
4. Consumer reacts to getting data (uses it)
5. `GOTO 3`

---

## Single Value Producer

`Promises` are _Push_ based (Consumer does not know when it will get the data back), but can return only one value and are then done.

```TypeScript
async function oneValueProducer(a: string): Promise<string> {
  //... async stuff...
  return foo;
}

/** Consumer */
let aPromise = oneValueProducer('foo');
let aValue = await aPromise;
// ... do stuff...
// need to call again to get more data
aValue = await oneValueProducer('bar');
```

---

## Multiple Value Producer

```TypeScript

let obs: Observable<string> = of(['foo', 'bar', 'baz']);

/** Consumer */
let subscription = obs.subsribe(value => {
  // when observable gives you a value, do stuff with it
  // ... stuff ...
})
```

---
template: inverse

# RxJs in our codebase

???
- A lot (but not all) of the examples of RxJS in our code base have to do with getting data from our API

---
## API/SDK

### Basic Data Retrieval

- Every function in our SDK which calls our API returns the data as an Observable, so we encounter them quite often.
- For most of our history of using Observables, we did not take advantage of much of the power that comes with RxJS
  - `Observable` has a `.toPromise()` method, so we would often just append `.toPromise()` to the end of our SDK function call and handle the response as a Promise

---
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

---
### Searching via the API

* Common

???
- It is quite common for our forms to contain a combobox where the user must choose from one of many options, say, Parent Place

--
* Many potential results

???
- While we _could_ block the form load while we get all the potential options, we have the potential to be downloading hundreds if not thousands of places, which would:

--
* Take a long time

???
  1. take a long time to download, consisting of many repeated calls to the API, and

--
* Slows down forms

???
  2. slow down our form considerably as it tracks and renders massive amounts of data

--
* Slow local search

???
  3. be slow to search since it would all be in-memory on the client side
- Instead, we commonly follow the pattern where we initially download the first 250 options, and give the user the ability to search
  - as the user types in the combobox, we send their text to the API, and repopulate the combobox dropdown with the first 250 places that match the user search text

---

# Imagine implementing this without RxJS...

* track keystrokes

???
We would need to:
- have a callback function that is called for every keystroke

--
* call API with timeout

???
- Call the API for every keystroke, or set up a `timeout` to call it after so many milliseconds

--
* await response

???
- await the response,

--
* handle changing inputs

???
- but if the user types more while we're waiting, we'd have to send another API request,

--
* handle request cancellations

???
but **you can't cancel a Promise**

- so now we have _two_ API calls in-flight, and _two_ Promises we're awaiting,
- and we need to know to ignore the first promise results somehow,
- and what if the user types some more, now we have _three_ API calls that could return in _any_ order

---
.center[![rage](assets/Rage_face.png)]

???
- and now the user has closed the form in disgust and we're still calling those APIs in the background and it's just a nightmare.

---
template: inverse
# OR

???
we could use RxJS and get use something like this

---

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

---
.center[![stream](assets/ecstatic.png)]

---
template: inverse
# Exercises/Examples

---
template: inverse
# Any questions?