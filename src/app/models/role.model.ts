import { Permission } from './permission.model';

export class Role
{
    iri: string;
    iriType: string;
    id: number;
    name: string;
    displayName: string;
    description: string;
    permissions: Permission[];

    /**
     * Constructor
     *
     * @param role
     */
    constructor(role:any|undefined)
    {
        role = role || {};
        this.iri        = role["@id"] || null;
        this.iriType    = role["@type"] || null;
        this.id = role.id || null;;
        this.name = role.name || null;
        this.displayName = role.display_name || null;
        this.description = role.description || null;
        let permissions = role.permissions || []; 
        this.permissions = permissions.map((permission: any)=>new Permission(permission)) || [];
    }

    
    /**
     * Add permission
     *
     * @param permission id
     */
    addPermission(permission: any): void
    {
        // if exist, dont add
        if (this.permissions.find( _permission => _permission === permission)){
            return;
        }
        // Add permission
        if ( permission )
        {
            this.permissions.push(permission);
        }

    }

    /**
     * Remove permission
     *
     * @param permission
     */
    removePermission(permission: any): void
    {
        const index = this.permissions.indexOf(permission);

        if ( index >= 0 )
        {
            this.permissions.splice(index, 1);
        }
    }
}
