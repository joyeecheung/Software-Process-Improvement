## Compatibility

Tested on Firefox 36, Chrome 41 and IE 10+. Partial support for IE9 (incomplete style since IE9 doesn't support CSS3 animations)

## A few notes

* These implementations uses the Promise/A+ API, which is part of the ES6 specification. A polyfill is included for IE support. 
* The random failure in S5 will stop subsequent calls and cause the negated message to be displayed in red. There is a global variable from the legacy code of S1, but the autoloading doesn't use it.