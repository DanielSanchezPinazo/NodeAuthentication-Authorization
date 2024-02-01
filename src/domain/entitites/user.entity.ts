import { CustomError } from "../errors/custom.error";


export class UserEntity {

    constructor(
        public id: string,
        public name: string,
        public email: string,
        public validatedEmail: boolean,
        public password: string,
        public role: string[],
        public img?: string, //! las propiedades opcionales deben ir al final
    ) {};

    static fromObject( object: {[key: string]: any} ) {

        const { id, _id, name, email, validatedEmail, password, role, img } = object;

        if ( !id && !_id ) throw CustomError.badRequest("Missing Id.");
        if ( !name ) throw CustomError.badRequest("Missing Name.");
        if ( !email ) throw CustomError.badRequest("Missing Email.");
        // como validatedEmail es un booleano hay que validarlo de la siguiente forma
        if ( validatedEmail === "undefined" ) throw CustomError.badRequest("Missing ValidatedEmail.");
        if ( !password ) throw CustomError.badRequest("Missing Password.");
        if ( !role ) throw CustomError.badRequest("Missing Role.");

        return new UserEntity( id || _id, name, email, validatedEmail, password, role, img );
    };
};




