export class Passenger {
    public firstname: string;
    public lastname: string;
    public gender: string;
    public title: string;
    public type: string;
    public dob?: string | null;
    public phone?: string | null;
    public email?: string | null;
    public id?: string | null;
    public address?: string | null;
    public hasExtraDetails?: string;

    constructor(
        firstname: string,
        lastname: string,
        gender: string,
        title: string,
        type: string,
        dob?: string | null,
        phone?: string | null,
        email?: string | null,
        id?: string | null,
        address?: string | null,
        hasExtraDetails?: string
    ) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.gender = gender;
        this.title = title;
        this.type = type;
        this.dob = dob;
        this.phone = phone;
        this.email = email;
        this.id = id;
        this.address = address;
        this.hasExtraDetails = hasExtraDetails;
    }
}

export class Payment {
    public id: string|undefined;
    public amout: string;
    public date: string;
    public modeOfPayment: string;

    constructor(
        amout: string,
        date: string,
        modeOfPayment: string,
        id?: string
    ) {
        this.id = id;
        this.amout = amout;
        this.date = date;
        this.modeOfPayment = modeOfPayment;
    }
}
