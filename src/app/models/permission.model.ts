
export class Permission
{
    iri: string;
    iriType: string;
    id: number;
    name: string;
    description: string;

    /**
     * Constructor
     *
     * @param permission
     */
    constructor(permission: any|undefined)
    {
        permission      = permission || {};
        this.iri        = permission["@id"] || null;
        this.iriType    = permission["@type"] || null;
        this.id         = permission.id || null
        this.name       = permission.name || null;
        this.description= permission.description || null;
    }
}
