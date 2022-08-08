export class Contact {
    public firstname: string;
    public lastname: string;
    public gender: string;
    public title: string;
    
    public dob?: string | null;
    public phoneNumbers?: {type: string, }[] | null;
    public email?: string | null;
    public id?: string | null;
    public addresses?: string[] | null;
    constructor(
       firstname: string,
     lastname: string,
     gender: string,
     title: string,
    
     dob?: string | null,
     phoneNumbers?: {type: string, number: string, countryCode: string }[] | null,
     email?: string | null,
     id?: string | null,
     addresses?: string[] | null,
    ) {

      this.firstname= firstname;
      this.lastname= lastname;
      this.gender= gender;
      this.title = title;
      
      this.dob= dob || null;
      this.phoneNumbers= phoneNumbers || null;
      this.email= email || null;
      this.id= id || null;
      this.addresses = addresses || null;

    }
}