const assert = require('assert'),
	RQL = require('../index');

const ds1 = [
		{id: 1, name: 'Jone', kind: '01'},
		{id: 2, name: 'Jeff', kind: '02'},
		{id: 3, name: 'Sara', kind: '01'},
		{id: 4, name: 'Jenny', kind: '02'}
	],
	ds2 = [
		{id: 2, dept: 'Management', k: '02'},
		{id: 3, dept: 'Planning', k: '01'}
	];

/*describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});
*/
describe('Main', function(){
	describe('#init', function(){
		it('must be accessed', () => {
			assert.ok(!!RQL);
		});
	});

	describe('#join', function(){
		const query = new RQL({
					dataset: ds1,
					alias: 'a'
				},
				{
					dataset: ds2,
					alias: 'b'
				});

		it('if there are no conditions for joining, it must be multiply number', () => {
			const result = query.execute();
			assert.equal(result.length, 8);
		});

		it('if there is a condition for joining, it must be 2', () => {
			const result = query.join({'a.id': 'b.id'})
							.execute();
			assert.equal(result.length, 2);
		});

		it('test', () => {
			const result = query.join({
					'a.id': 'b.id', 
					'a.kind': 'b.k'
				})
				.execute();

			assert.equal(result.length, 1);
		})
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