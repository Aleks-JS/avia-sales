class EventEmitter {
    constructor () {
        this.handlers = {}
    }

    addEventListener (name, handler, once = false) {
        if (!this.handlers.hasOwnProperty(name)) {
            this.handlers[name] = []
        }

        this.handlers[name].push({ once, handler })
    }

    removeEventListener (name = null, handler = null) {
        if (!name) {
            this.handlers = {}
        }

        else if (!handler) {
            if (this.handlers.hasOwnProperty(name)) {
                delete this.handlers[name]
            }
        }

        else {
            if (this.handlers.hasOwnProperty(name)) {
                this.handlers[name] = this.handlers[name].filter(x => x.handler !== handler)

                if (!this.handlers[name].length) {
                    delete this.handlers[name]
                }
            }
        }
    }

    on (...args) {
        this.addEventListener(...args)
    }

    off (...args) {
        this.removeEventListener(...args)
    }

    once (name, handler) {
        this.addEventListener(name, handler, true)
    }

    emit (name, ...args) {
        const emitMaster = (name, ...args) => {
            if (!this.handlers[name]) {
                return
            }
    
            const originalHandlers = this.handlers[name]
            this.handlers[name] = this.handlers[name].filter(x => !x.once)
    
            for (const { handler } of originalHandlers) {
                handler(...args)
            }
        }

        if (name !== '$all') {
            emitMaster('$all', name, ...args)
        }
        
        emitMaster(name, ...args)
    }
}