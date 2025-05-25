# namespace-lookup

[![Test](https://github.com/gbv/namespace-lookup/actions/workflows/test.yml/badge.svg?branch=dev)](https://github.com/gbv/namespace-lookup/actions/workflows/test.yml)
[![NPM Version](http://img.shields.io/npm/v/namespace-lookup.svg?style=flat)](https://www.npmjs.org/package/namespace-lookup)

> Find the longest prefix that a string starts with

This Node package implements a [radix tree](https://en.wikipedia.org/wiki/Radix_tree) too efficiently look up whether a string starts with a prefix from a set of prefix strings.

# Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [License](#license)

## Install 

```bash
npm install namespace-lookup
```

## Usage

~~~js
import { Namespaces } from "namespace-lookup"

const namespaces = new Namespaces() // optionally pass an array of prefixes

namespaces.add("http://purl.org/dc/elements/1.1/")
namespaces.add("http://purl.org/dc/terms/")

namespaces.lookup("http://purl.org/dc/terms/title") // http://purl.org/dc/terms/
namespaces.lookup("http://schema.org/title")        // undefined
~~~

An alternative, less performant implementation is this (also exportable):

~~~js
class NamespacesArray extends Set {
  lookup(str) {
    for (let namespace of this) {
      if (str.startsWith(namespace)) {
        return namespace
      }
    }
  }
}
~~~

Class `Namespaces` also supports to add prefixes with a payload (any value except `null`) to be returned instead:

~~~js
namespaces.add("http://purl.org/dc/elements/1.1/","dc")
namespaces.add("http://purl.org/dc/terms/","dct")

namespaces.lookup("http://purl.org/dc/terms/title") // dct
~~~

Prefixes and payloads can also be passed as object:

~~~js
namespaces = new Namespaces({
  "http://purl.org/dc/elements/1.1/": "dc",
  "http://purl.org/dc/terms/": "dct"
})
~~~

## Maintainers

- [@nichtich](https://github.com/nichtich) (Jakob Voß)

## Contribute

Contributions are welcome! Best use [the issue tracker](https://github.com/gbv/namespace-lookup/issues) for questions, bug reports, and/or feature requests!

## License

The implementation is based on a [detailed description](https://mroseman.com/blog/autocomplete-radix-tree/) of the algorithm by Matt Roseman.

MIT license
