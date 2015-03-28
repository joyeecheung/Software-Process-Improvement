## Compatibility

Tested on Firefox 36, Chrome 41 and IE 10+. Partial support for IE9 (incomplete style since IE9 doesn't support CSS3 animations)

## A few notes

* These implementations uses the Promise/A+ API, which is part of the ES6 specification. A polyfill is included for IE support. 
* The random failure in S5 will stop subsequent calls and cause the negated message to be displayed in red. There is a global variable from the legacy code of S1, but the autoloading for S5 doesn't use it.
* In S5, the probability of failure for each handler(including the bubble handler) is set to 0.3.
* If you see the buttons initialized again during the operation, you might have been accidentally moved your mouse away from the funtional area for a very short moment, which will cause the calculator to be reset. To see it at work properly again, move your mouse away for a few seconds, then start what you want to do again.
