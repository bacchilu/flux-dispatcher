'use strict';


const Dispatcher = (function () {
	let lastId = 1;
	let callbacks = {};
	let isDispatching = false;
	let currentPayload;

	const exec = function (ids) {
		ids.forEach(function (id) {
			if (callbacks[id]['state'] === true)
				throw 'Dispatcher.waitFor(...): Circular dependency detected.'
			if (callbacks[id]['state'] === false)
				return;

			callbacks[id]['state'] = true;
			callbacks[id]['cb'](currentPayload);
			callbacks[id]['state'] = false;
		});
	};

	return {
		register: function (callback) {
			const id = 'ID_' + lastId++;
			callbacks[id] = {cb: callback, state: null};
			return id;
		},
		unregister: function (id) {
			delete callbacks[id];
		},
		dispatch: function (payload) {
			if (isDispatching === true)
				throw 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.';

			isDispatching = true;
			for (let id in callbacks)
				callbacks[id]['state'] = null;
			currentPayload = payload;

			exec(Object.keys(callbacks));

			isDispatching = false;
		},
		idDispatching: function () {
			return isDispatching;
		},
		waitFor: function (ids) {
			if (isDispatching === false)
				throw 'Dispatcher.waitFor(...): Must be invoked while dispatching.'

			exec(ids);
		}
	};
})();


module.exports = Dispatcher;
