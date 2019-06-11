import { Observable, Subject, Subscription } from "rxjs";
import { delay, takeUntil } from "rxjs/operators";
import { helpers } from "./helpers";

export function observableBasics() {
    // Subject (Observer AND Observable)
    let finalTimeout: Subject<void> = new Subject<void>();

    // Creating an Observable from scratch
    let observable = Observable.create((observer: any) => {
        try {
            // emit two messages immediately upon subscription
            observer.next(`Hey subscribers!`);
            observer.next(`How do you do this fine day?`);
            // emit a final message, followed by a completion, after 2 seconds
            setInterval(() => {
                observer.next('I am good (thanks for asking)');
                observer.complete();
                observer.next(`You'll never see this, because I have completed!`);
            }, 2000);
        } catch (error) {
            observer.error(error);
            observer.next(`You'll never see this, because I have errored!`);
        }
    }).pipe(
        delay(1000) // let's give ourselves a second to switch to the browser
    );

    // our first subscription
    // subscribing executes the observable
    let subscription: Subscription = observable.subscribe(
        // next:
        (x: any) => helpers.addItem(x),
        // error:
        (error: any) => helpers.addItem(error),
        // complete:
        () => helpers.addItem('Completed')
    );

    // wait a second, then subscribe to the same observable again,
    // and unsubscribe the first subscription
    setTimeout(() => {
        observable
            .pipe(takeUntil(finalTimeout))
            .subscribe((x: any) => helpers.addItem(`Subscriber 2: ${x}`));
        subscription.unsubscribe();
    }, 1000);

    // after 6 seconds, push and complete
    setTimeout(() => {
        finalTimeout.next();
        finalTimeout.complete();
    }, 6000);
}
