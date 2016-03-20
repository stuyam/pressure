# How to Contribute

Yay, you're interested in helping this thing suck less.  Thank you!

## Project Layout

  - `src/`      - JavaScript Source
  - `dist/`     - Compiled and Minified
  - `examples/` - Example test cases in browser

## Having a problem?

A **great** way to start a discussion about a potential issue is to
submit an issue with the device, OS, and browser info.

## Have an idea to make it better?

Again, guard your time and effort.  Make sure that you don't spend a lot
of time on an improvement without talking through it first.

## Getting to work

```sh
npm install --dev
gulp watch
```
When you edit and save the files in the `src/` directory it will recompile the
pressure.js and jquery.pressure.js libraries (including the minified versions)
and drop them into the `dist/` directory.

## Pull Requests

Good Pull Requests include:

  - A clear explaination of the problem (or enhancement)
  - Clean commit history (squash where it makes sense)
  - Relevant Explination of how to test

Thanks to [Payform](https://github.com/jondavidjohn/payform) for the contribution template.
