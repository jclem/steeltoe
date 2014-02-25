# SteelToe

Don't shoot yourself in the foot while traversing JavaScript objects.

## Get It

```sh
$ npm install steeltoe --save
```

## Usage

SteelToe is a tiny JavaScript function that makes it safe to traipse about
objects without worrying about whether keys may or may not exist, and whether
it's safe to try and look inside of them. It also provides basic
[autovivification](http://en.wikipedia.org/wiki/Autovivification) of objects
through the `set` function.

### Getting Values

#### Method #1
```javascript
var object = { info: { name: { first: 'Jonathan', last: 'Clem' } } }

steelToe(object)('info')('name')('last')();           // 'Clem'
steelToe(object)('info')('features')('hairColor')();  // undefined
```

#### Method #2
```javascript
var object = { info: { name: { first: 'Jonathan', last: 'Clem' } } }

steelToe(object).get('info.name.last');          // 'Clem'
steelToe(object).get('info.features.hairColor'); // undefined
```

### Setting Values

```javascript
var jonathan = { info: { name: { first: 'Jonathan', last: 'Clem' } } },

steelToe(jonathan).set('info.name.middle', 'Tyler');
steelToe(jonathan).set('info.favorites.movie', 'Harold & Maude');

jonathan.info.name.middle; // Tyler
jonathan.info.favorites.movie; // Harold & Maude
````

## Details

Let's say you've got some deeply nested data in JavaScript objects that you've just parsed from a JSON API response. For each result, you need to do something if there's some sort of data present:

```javascript
var fatherFirstNames = [];

for (var i = 0; i < families.length; i ++) {
  var first = families[i].father.info.name.first;

  if (first) {
    fatherFirstNames.push(first);
  }
}

// TypeError: 'undefined' is not an object (evaluating 'family.father.info.name.first')
```

Whoops! You shot yourself in the foot. You got a `TypeError` because you had no
guarantee that the family had a father, or that the father had info present, or
that his name was returned! You fix it by writing this monstrosity:

```javascript
var farherFirstNames = [];

for (var i = 0; i < families.length; i++) {
  var father = families[i].father;

  if (father && father.info && father.info.name && father.info.name.first) {
    fatherFirstNames.push(father.info.name.first);
  }
}
```

Or, you could use SteelToe and write this:

```javascript
var fatherFirstNames = [];

for (var i = 0; i < families.length; i++) {
  var name = steelToe(families[i]).get('father.info.name.first');

  if (name) {
    fatherFirstNames.push(name);
  }
}

fatherFirstNames; // ["Hank", "Dale", "Bill"]
```

## The End

SteelToe was made when a coworker of mine said that he wished someone would
write a JavaScript library that would allow him to traverse objects without
shooting himself in the foot, and that the library was called SteelToe.
