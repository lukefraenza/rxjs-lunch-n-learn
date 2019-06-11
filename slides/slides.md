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
3. In our codebase

???
After that, I'll show you the two most common ways RxJS is currently used in our codebase

--
4. Exercises

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
layout: inverse
## Why pure functions?
???
- They're predictable; they don't do anything _sneaky_
- Doesn’t mutate anything
- Always returns the same value based on the same parameters
  - Isn't affected by outside state that may change
- No side effects. It can’t mutate state outside of the function

---

# Pull vs. Push

---

## Producer/Consumer

**Producer**: thing that gives you data

**Consumer**: thing that needs the data

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

