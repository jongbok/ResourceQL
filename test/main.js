const assert = require('assert'),
	RQL = require('../index');

const ds1 = [
		{id: 1, name: 'Jone', kind: '01'},
		{id: 2, name: 'Jeff', kind: '02'},
		{id: 3, name: 'Sara', kind: '01'},
		{id: 4, name: 'Jenny', kind: '02'}
	],
	ds2 = [
		{
			id: 2, 
			dept: 'Management', 
			k: '02', 
			sub: {kind: '01'},
			arr: [
				{},
				{kind: '01'},
				{}
			]
		},
		{
			id: 3, 
			dept: 'Planning', 
			k: '02', 
			sub: {kind: '02'},
			arr: [
				{},
				{kind: '03'},
				{}
			]
		}
	];

describe('#init', function(){
	it('must be accessed', () => {
		assert.ok(!!RQL);
	});
});


describe('#join', function(){

	describe('#inner', function(){
		const query = RQL.query({
			left: { dataset: ds1, alias: 'a'},
			right: { dataset: ds2, alias: 'b'}
		});

		it('there are no conditions', () => {
			const result = query.execute();
			assert.equal(result.length, 8);
		});

		it('there is a condition', () => {
			const result = query.join({'a.id': 'b.id'})
							.execute();
			assert.equal(result.length, 2);
		});

		it('there are multiple conditions', () => {
			const result = query.join({
					'a.id': 'b.id', 
					'a.kind': 'b.k'
				})
				.execute();

			assert.equal(result.length, 1);
		});

		it('there is a condition in inner object', () => {
			const result = query.join({
				'a.kind': 'b.sub.kind'
			})
			.execute();

			assert.equal(result.length, 4);
		});

		it('there is a condition in object of array', () => {
			const result = query.join({
				'a.kind': 'b.arr.1.kind'
			})
			.execute();

			assert.equal(result.length, 2);
		});
	});

	describe('#left', function(){
		const query = RQL.query({
			type: 'left',
			left: { dataset: ds1, alias: 'a'},
			right: { dataset: ds2, alias: 'b'}
		});

	});
});

/*
query = new RQL({
			dataset: ds1,
			alias: 'a'
		},
		{
			dataset: ds2,
			alias: 'b'
		})
	.select({
		'a.column1',
		'a.column2',
		'b.column1' : 'bcolumn1'
	})
	.join({'a.column1': 'b.column1'})
	.where({
		'a.column1': 'value1', 
		'a.column2': { $gte: 30}
	})
	.sort({'column1': '$asc', 'column2': '$desc'})

result = query.execute();

join({
	$type: 'left'
})

ds1, ds2
inner join
outer join  (left, right)
where
*/