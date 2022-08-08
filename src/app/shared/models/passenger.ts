
    export interface Geo {
        lat: string;
        lng: string;
    }

    export interface Address {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: Geo;
    }

    export interface Service {
        title: string;
        catchPhrase: string;
        bs: string;
    }

    export interface Passenger {
        id: number;
        firstName: string;
        lastName: string;
        title: string;
        email: string;
        gender: string;
        phone: string;
        dateOfBirth: string;
        ageCategory: string;
        services: Service;
    }


