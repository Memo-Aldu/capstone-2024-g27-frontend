export interface IContact {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    tel: string;
}

export const ContactList: IContact[] = [
    {
        id : new Date().toJSON().toString(),
        firstname : "Jean",
        lastname: "Mar",
        email: "email1@email.com",
        tel: "1111111111",
    },
];

export enum PageEnum {
    list,
    add,
}