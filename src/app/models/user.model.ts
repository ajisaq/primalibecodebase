import { Role } from './role.model';

export class User
{
    iri: string;
    iriType: string;
    id: number;
    firstName: string;
    lastName: string;
    avatar: string;    
    company: string;
    jobTitle: string;
    email: string;
    password: string|null;
    phone: string;
    address: string;
    birthDate: Date;
    notes: string;
    moduleRoles: Role[];
    isNew: boolean;
    isEnabled: boolean;

    /**
     * Constructor
     *
     * @param user
     */
    constructor(user: any)
    {
        let iri = typeof user ==="string" ? user : null;
        let id  = typeof user ==="number" ? user : null;
        
        user      = user || {};
        this.iri    = iri? iri:user["@id"];
        this.iriType= user["@type"] || null;
        // user = user || {};
        this.id = user.id || id;
        this.firstName = user.first_name || null;
        this.lastName = user.last_name || null;
        this.avatar = user.avatar || 'assets/images/avatars/profile.jpg';
        this.company = user.company || null;
        this.jobTitle = user.job_title || null;
        this.email = user.email || null;
        this.password = null;
        this.phone = user.phone || null;
        this.address = user.address || null
        this.birthDate = user.birth_date || null;
        this.notes = user.notes || null;
        this.isNew = user.is_new || false;
        this.isEnabled = user.is_enabled || false;
        let moduleRoles = user.module_roles || [];
        this.moduleRoles = moduleRoles.map((role: string)=>new Role(role)) || [];
    }

    fullName = () => {
        return this.firstName + ' ' + this.lastName;
    }
}
