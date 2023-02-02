type SignalHandler<T> = (data?:T) => void;

export default class Signal<T> {
	private listeners: SignalHandler<T>[];

	constructor() {
		this.listeners = []
	}

	connect(cb:SignalHandler<T>) {
		this.listeners.push(cb)
	}

	disconnect(cb:SignalHandler<T>) {
		this.listeners = this.listeners.filter(l => l !== cb)
	}

	dispatch(data?:T) {
		this.listeners.forEach(cb => cb(data))
	}
}