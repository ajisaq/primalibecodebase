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
