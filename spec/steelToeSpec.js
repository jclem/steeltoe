var steelToe = require('../index');

describe("steelToe", function () {
  var object, toe;

  beforeEach(function () {
    object = { name: { first: 'Jonathan', last: 'Clem' } };
    toe = steelToe(object);
  });

  describe("getting values", function () {
    it("can return its original object", function () {
      expect(toe()).toEqual(object);
    });

    it("can access root-level keys", function () {
      expect(toe('name')()).toEqual({ first: 'Jonathan', last: 'Clem' })
    });

    it("returns undefined for root-level keys that are undefined", function () {
      expect(toe('nope')()).not.toBeDefined();
    });

    it("returns undefined for undefined keys nested in defined keys", function () {
      expect(toe('name')('middleName')()).not.toBeDefined();
    });

    it("returns undefined for undefined keys nested in undefined keys", function () {
      expect(toe('nope')('noWay')()).not.toBeDefined();
    });

    describe("#get", function () {
      describe("with no traversal chain", function () {
        it("returns its object", function () {
          expect(toe.get()).toEqual(object);
        });
      });

      describe("with a traversal chain", function () {
        it("splits a string of keys and walks through the object", function () {
          expect(toe.get('name.first')).toEqual(toe('name')('first')());
        });

        it("returns undefined properties properly", function () {
          expect(toe.get('this.is.bad')).not.toBeDefined();
        });
      });
    });
  });

  describe("setting values", function () {
    describe("for a root-level key", function () {
      beforeEach(function () {
        toe.set('key', 'value');
      });

      it("should set the key to the given value", function () {
        expect(toe('key')()).toEqual('value');
      });
    });

    describe("for an existing key nested in an existing object", function () {
      beforeEach(function () {
        toe.set('name.first', 'New Name');
      });

      it("should set the key to the given value", function () {
        expect(toe('name')('first')()).toEqual('New Name');
      });
    });

    describe("for a non-existent key nested in an existing object", function () {
      beforeEach(function () {
        toe.set('name.middle', 'New Name');
      });

      it("should set the key to the given value", function () {
        expect(toe('name')('middle')()).toEqual('New Name');
      });
    });

    describe("for a non-existent key nested in a non-existent object", function () {
      beforeEach(function () {
        toe.set('info.age', 26);
      });

      it("should create the non-existent object", function () {
        expect(toe('info')()).toEqual({ age: 26 });
      });

      it("should set the key to the given value", function () {
        expect(toe('info')('age')()).toEqual(26);
      });
    });

    describe("setting multiple values", function () {
      beforeEach(function () {
        toe.set('info.name.first', 'George');
        toe.set('info.name.last', 'Washington');
      });

      it("should set both values", function () {
        expect(toe.get('info.name')).toEqual({ first: 'George', last: 'Washington' });
      });
    });

    describe("for a non-existent key nested multiple levels into in a non-existent object", function () {
      beforeEach(function () {
        toe.set('info.birthplace.city', 'Indianapolis');
      });

      it("creates the non-existent objects", function () {
        expect(toe('info')()).toEqual({ birthplace: { city: 'Indianapolis' } });
      });

      it("should set the key to the given value", function () {
        expect(toe('info')('birthplace')('city')()).toEqual('Indianapolis');
      });
    });
  });
});
