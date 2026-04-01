export namespace engine {
	
	export class RenderChar {
	    Char: number;
	    State: number;
	
	    static createFrom(source: any = {}) {
	        return new RenderChar(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Char = source["Char"];
	        this.State = source["State"];
	    }
	}

}

