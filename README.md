## ECMAScript Cancel Tokens

### Overview and Motivation

Asynchronous APIs frequently need to provide the user with some way to cancel long running or expensive operations.  Some examples:

- A browser HTTP fetch API needs to allow the user to cancel network operations if the current request is no longer required by the user interface.
- A database access API needs to allow the user to cancel a long-running query when the client no longer needs the results of that query.
- A promise-based Observable implementation (where the subscription method returns a promise) needs to allow the user to cancel the subscription.

Userland promise libraries have addressed this need by adding a `cancel` method to promises.  This proposal explores a different solution, inspired by the [.NET task cancellation architecture](https://msdn.microsoft.com/en-us/library/dd997396.aspx).

Conceptually, a *cancel token* is created by the initiator of the asynchronous work.  Cancellation may be requested at any time by the creator of the token.  The *cancel token* is then passed as an argument to the function that starts the asynchronous operation.  The receiver of the token can:

- Synchronously check at any time for a cancellation request.
- Synchronously throw an error if cancellation has been requested.
- Register a callback that will be executed if cancellation is requested.
- Pass the *cancel token* to subtasks if it chooses to do so.

A primary feature of this design is that cancellation semantics are completely determined by the asynchronous operation that receives the token.  There are no automatic or default cancellation effects.

The cancel token API is comprised of two new built-in constructors:  *CancelError* and *CancelToken*.

### CancelError

*CancelError* is a native error type used to indicate that an asynchronous operation has been cancelled.

### CancelToken

The *CancelToken* constructor is a built-in constructor that creates and initializes a new *CancelToken* object.

#### new CancelToken ( _executor_ )

Creates and initializes a new *CancelToken* object by calling _executor_ with a function that, when called, requests cancellation.

```js
// Create a token which requests cancellation when a button is clicked.
let token = new CancelToken(cancel => {
    $("#some-button").on("click", cancel);
});
```

```js
// Create a token which requests cancellation when a promise is resolved
let token = new CancelToken(cancel => {
    somePromise.then(cancel);
});
```

#### get CancelToken.prototype.requested

Synchronously returns a Boolean value indicating whether cancellation has been requested for this token.

```js
async function f(cancelToken) {
    await a();
    // Only execute `b` if task has not been cancelled.
    if (!cancelToken.requested)
        await b();
}
```

#### get CancelToken.prototype.promise

Returns a promise which will be resolved with a *CancelError* if cancellation has been requested for this token.

```js
function delay(ms, cancelToken) {
    return new Promise((resolve, reject) => {
        // Register rejection if cancellation is requested.
        cancelToken.promise.then(reject);
        setTimeout(_=> resolve(), ms);
    });
}
```

#### CancelToken.prototype.throwIfRequested ( )

Synchronously throws a *CancelError* if cancellation has been requested for this token.

```js
async function f(cancelToken) {
    await a();
    // Throw a CancelError upon cancellation
    cancelToken.throwIfRequested();
    await b();
}
```
