export namespace engine {
	
	export class RenderChar {
	    char: string;
	    state: string;
	
	    static createFrom(source: any = {}) {
	        return new RenderChar(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.char = source["char"];
	        this.state = source["state"];
	    }
	}
	export class Stats {
	    index: number;
	    total: number;
	    typedCount: number;
	    correctCount: number;
	    typos: number;
	    accuracy: number;
	    speedCpm: number;
	    progress: number;
	    complete: boolean;
	    elapsedMs: number;
	
	    static createFrom(source: any = {}) {
	        return new Stats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.index = source["index"];
	        this.total = source["total"];
	        this.typedCount = source["typedCount"];
	        this.correctCount = source["correctCount"];
	        this.typos = source["typos"];
	        this.accuracy = source["accuracy"];
	        this.speedCpm = source["speedCpm"];
	        this.progress = source["progress"];
	        this.complete = source["complete"];
	        this.elapsedMs = source["elapsedMs"];
	    }
	}

}

export namespace main {
	
	export class Exercise {
	    id: string;
	    title: string;
	    language: string;
	    difficulty: string;
	    code: string;
	
	    static createFrom(source: any = {}) {
	        return new Exercise(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.language = source["language"];
	        this.difficulty = source["difficulty"];
	        this.code = source["code"];
	    }
	}
	export class AppState {
	    exercise: Exercise;
	    render: engine.RenderChar[];
	    stats: engine.Stats;
	    expected: string;
	
	    static createFrom(source: any = {}) {
	        return new AppState(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.exercise = this.convertValues(source["exercise"], Exercise);
	        this.render = this.convertValues(source["render"], engine.RenderChar);
	        this.stats = this.convertValues(source["stats"], engine.Stats);
	        this.expected = source["expected"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

