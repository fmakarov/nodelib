import { Suite, Event, Options } from 'benchmark';
import * as fsWalkPrevious from '@nodelib/fs.walk';

import * as fsWalkCurrent from '..';

const BENCHMARK_CWD = process.env.BENCHMARK_CWD ?? process.cwd();

type Deferred = { resolve: () => void };

const commonOptions: Options = {
	defer: true,
	initCount: 100,
	maxTime: 120
};

const result = {
	count: 0
};

const suite = new Suite('fs.walk');

suite
	.add('fs.walk current', {
		...commonOptions,
		fn: (deferred: Deferred) => {
			fsWalkCurrent.walk(BENCHMARK_CWD, (_error, entries) => {
				result.count = entries.length;
				deferred.resolve();
			});
		}
	})
	.add('fs.walk previous', {
		...commonOptions,
		fn: (deferred: Deferred) => {
			fsWalkPrevious.walk(BENCHMARK_CWD, () => {
				deferred.resolve();
			});
		}
	})
	.on('cycle', (event: Event) => {
		console.log(String(event.target));
	})
	.on('complete', function (this: Suite) {
		console.log(`Fastest is ${this.filter('fastest').map('name')} for ${result.count} entries`);
	})
	.run();
