import { Suite, Event, Options } from 'benchmark';
import * as fsScandirPrevious from '@nodelib/fs.scandir';

import * as fsScandirCurrent from '..';

const BENCHMARK_CWD = process.env.BENCHMARK_CWD ?? process.cwd();

type Deferred = { resolve: () => void };

const commonOptions: Options = {
	defer: true,
	initCount: 100,
	maxTime: 60
};

const result = {
	count: 0
};

const suite = new Suite('fs.scandir');

suite
	.add('fs.scandir current', {
		...commonOptions,
		fn: (deferred: Deferred) => {
			fsScandirCurrent.scandir(BENCHMARK_CWD, (_error, entries) => {
				result.count = entries.length;
				deferred.resolve();
			});
		}
	})
	.add('fs.scandir previous', {
		...commonOptions,
		fn: (deferred: Deferred) => {
			fsScandirPrevious.scandir(BENCHMARK_CWD, () => {
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
