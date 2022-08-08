
export class CabinClass
{
    iri: string;
    iriType: string;
    id: number;
    name: string;
    code: string;


    /**
     * Constructor
     *
     * @param cabinClass
     */
    constructor(cabinClass?: any)
    {
        cabinClass  = cabinClass || {};

        let iri     = typeof cabinClass ==='string' ? cabinClass : null;
        let id      = typeof cabinClass ==='number' ? cabinClass : null;
        this.iri    = cabinClass["@id"] || iri;

        cabinClass = cabinClass || {};
        this.iri = cabinClass["@id"] || iri;
        this.iriType = cabinClass["@type"] || null;
        this.id         = cabinClass.id || id;
        this.name       = cabinClass.name || null;
        this.code   = cabinClass.code || null;
    }
}