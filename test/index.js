import { test } from 'uvu';
import * as assert from 'uvu/assert';
import fn from '../src';

function same(a, b) {
	assert.is(fn(a, b), true);
}

function different(a, b) {
	assert.is(fn(a, b), false);
}

test('exports', () => {
	assert.type(fn, 'function');
});

test('scalars', () => {
	same(1, 1);
	different(1, 2);
	different(1, []);
	different(1, '1');
	same(Infinity, Infinity);
	different(Infinity, -Infinity);
	different(NaN, undefined);
	different(NaN, null);
	same(NaN, NaN);
	different(1, -1);
	same(0, -0);

	same(null, null);
	same(void 0, undefined);
	same(undefined, undefined);
	different(null, undefined);
	different('', null);
	different(0, null);

	same(true, true);
	same(false, false);
	different(true, false);
	different(0, false);
	different(1, true);

	same('a', 'a');
	different('a', 'b');
});

test('Objects', () => {
	same({}, {});
	same({ a:1, b:2 }, { a:1, b:2 });
	same({ b:2, a:1 }, { a:1, b:2 });

	different({ a:1, b:2, c:[] }, { a:1, b:2 });
	different({ a:1, b:2 }, { a:1, b:2, c:[] });
	different({ a:1, c:3 }, { a:1, b:2 });

	same({ a:[{ b:1 }] }, { a:[{ b:1 }] });
	different({ a:[{ b:2 }] }, { a:[{ b:1 }] });
	different({ a:[{ c:1 }] }, { a:[{ b:1 }] });

	different([], {});
	different({}, []);
	different({}, null);
	different({}, undefined);

	different({ a:void 0 }, {});
	different({}, { a:undefined });
	different({ a:undefined }, { b:undefined });
});

test('Arrays', () => {
	same([], []);
	same([1,2,3], [1,2,3]);
	different([1,2,4], [1,2,3]);
	different([1,2], [1,2,3]);

	same([{ a:1 }, { b:2 }], [{ a:1 }, { b:2 }]);
	different([{ a:2 }, { b:2 }], [{ a:1 }, { b:2 }]);

	different({ '0':0, '1':1, length:2 }, [0, 1]);
});

test('Dates', () => {
	same(
		new Date('2015-05-01T22:16:18.234Z'),
		new Date('2015-05-01T22:16:18.234Z')
	);

	different(
		new Date('2015-05-01T22:16:18.234Z'),
		new Date('2017-01-01T00:00:00.000Z')
	);

	different(
		new Date('2015-05-01T22:16:18.234Z'),
		'2015-05-01T22:16:18.234Z'
	);

	different(
		new Date('2015-05-01T22:16:18.234Z'),
		1430518578234
	);

	different(
		new Date('2015-05-01T22:16:18.234Z'),
		{}
	);
});

test('RegExps', () => {
	same(/foo/, /foo/);
	same(/foo/i, /foo/i);

	different(/foo/, /bar/);
	different(/foo/, /foo/i);

	different(/foo/, 'foo');
	different(/foo/, {});
});

test('Functions', () => {
	let foo = () => {};
	let bar = () => {};

	same(foo, foo);
	different(foo, bar);
	different(foo, () => {});
});

test('kitchen sink', () => {
	same({
    prop1: 'value1',
    prop2: 'value2',
    prop3: 'value3',
    prop4: {
      subProp1: 'sub value1',
      subProp2: {
        subSubProp1: 'sub sub value1',
        subSubProp2: [1, 2, {prop2: 1, prop: 2}, 4, 5]
      }
    },
    prop5: 1000,
    prop6: new Date(2016, 2, 10)
  }, {
    prop5: 1000,
    prop3: 'value3',
    prop1: 'value1',
    prop2: 'value2',
    prop6: new Date('2016/03/10'),
    prop4: {
      subProp2: {
        subSubProp1: 'sub sub value1',
        subSubProp2: [1, 2, {prop2: 1, prop: 2}, 4, 5]
      },
      subProp1: 'sub value1'
    }
  });
});

test.run();
