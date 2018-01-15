/**
*	ResourceQL.js 0.1
*	(c) 2018 Jongbok Park.
*	ResourceQL may be freely distributed under the MIT license.
**/
const _ = require('lodash');

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
    merge = (row1, row2) => {
    	const keys = _.keys(row2),
    		len = keys.length,
    		result = _.assign({}, row1);
    	let key;
    	
    	for(let i=0; i<len; i++){
    		key = getKey(result, keys[i]);
    		result[key] = row2[keys[i]];
    	}
    	return result;
    };

class RQL{
	constructor(left, right){
		if(!isDataset(left.dataset))
			throw new Error('The first dataset is not valid!');
		if(!isDataset(right.dataset))
			throw new Error('The second dataset is not valid!');
		this.left = left;
		this.right = right;
	}

	execute(){
		const result = [],
			ds1 = this.left.dataset,
			ds2 = this.right.dataset,
			ds1len = ds1.length,
			ds2len = ds2.length;
		let row1, row2, i, j;

		for(i = 0; i<ds1len; i++){
			for(j = 0; j<ds2len; j++){
				result.push(merge(ds1[i], ds2[j]));
			}
		}

		return result;
	}

	select(){

		return this;
	}

	join(conditions){

		return this;
	}

	sort(){

		return this;
	}
}

module.exports = RQL;