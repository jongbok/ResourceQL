/**
*	ResourceQL.js 0.1
*	(c) 2018 Jongbok Park.
*	ResourceQL may be freely distributed under the MIT license.
**/
const _ = require('lodash');

const LEFT = Symbol(),
	RIGHT = Symbol(),
	COLUMNS = Symbol(),
	JOINS = Symbol(),
	FILTERS = Symbol(),
	SORTS = Symbol();

const MERGE = Symbol();

const isDataset = ds => {
    	if(!ds)
    		return false;
    	if(!_.isArray(ds))
    		return false;

    	return ds.every((row) => _.isPlainObject(row));
    },
    getKey = (obj, key) => {
    	let k = key;
    	while(_.has(obj, k))
    		k += '$';
    	return k;
    },
    getValue = (obj, keys) => {
    	if(!keys.length)
    		throw new Error('name of column is empty');

    	let v = obj;
    	for(let i=0, len = keys.length; i<len; i++){
    		v = v[keys[i]];
    	}

    	return v;
    },
    every = (funces, ...args) => {
    	for(let i=0, len=funces.length; i<len; i++){
    		if(!funces[i].apply(null, args))
    			return false;
    	}
    	return true;
    };

class RQL{
	constructor(left, right){
		this[LEFT] = _.isArray(left) ?  {dataset: _.cloneDeep(left), alias: 'a'} : _.cloneDeep(left);
		this[RIGHT] = _.isArray(right) ? {dataset: _.cloneDeep(right), alias: 'b'} : _.cloneDeep(right);

		if(!isDataset(this[LEFT].dataset))
			throw new Error('The first dataset is not valid!');
		if(!isDataset(this[RIGHT].dataset))
			throw new Error('The second dataset is not valid!');
	}

	execute(){
		const result = [],
			ds1 = this[LEFT].dataset,
			ds2 = this[RIGHT].dataset,
			ds1len = ds1.length,
			ds2len = ds2.length;
		let row1, row2, i, j;

		for(i = 0; i<ds1len; i++){
			for(j = 0; j<ds2len; j++){
				if(this[JOINS] && this[JOINS].length && !every(this[JOINS], ds1[i], ds2[j]))
					continue;
				result.push(this[MERGE](ds1[i], ds2[j]));
			}
		}

		return result;
	}

	[MERGE](row1, row2){
    	const keys = _.keys(row2),
    		len = keys.length,
    		result = _.assign({}, row1);
    	let key;
    	
    	for(let i=0; i<len; i++){
    		key = getKey(result, keys[i]);
    		result[key] = row2[keys[i]];
    	}
    	return result;
	}

	select(columns){
		this[COLUMNS] = _.cloneDeep(columns);
		return this;
	}

	join(joins){
		const leftAlias = this[LEFT].alias,
			rightAlias = this[RIGHT].alias,
			aliases = [leftAlias, rightAlias];

		this[JOINS] = _.keys(joins).map((key) => {
			const key1 = key,
				key2 = joins[key],
				parsed1 = key1.split('.'),
				parsed2 = key2.split('.'),
				alias1 = parsed1.shift(),
				alias2 = parsed2.shift();

			if(!parsed1.length || !parsed2.length)
				throw new Error('Alias of the dataset must be set for joining!');
			if(!_.includes(aliases, alias1) || !_.includes(aliases, alias2))
				throw new Error('Alias of the dataset is not matched!');

			return (leftRow, rightRow) => {
				const v1 = alias1 === leftAlias ? getValue(leftRow, parsed1) : getValue(rightRow, parsed1),
					v2 = alias2 === leftAlias ? getValue(leftRow, parsed2) : getValue(rightRow, parsed2);

				return v1 === v2;
			};
		});

		return this;
	}

	filter(filters){
		this[FILTERS] = _.cloneDeep(filters);
		return this;
	}

	sort(sorts){
		this[SORTS] = _.cloneDeep(sorts);
		return this;
	}
}

class Command{
	constructor(commandes){
		this.commandes = commandes || [];
	}

	run(){
		if(this.commandes && this.commandes.length){

		}
	}
}

module.exports = RQL;