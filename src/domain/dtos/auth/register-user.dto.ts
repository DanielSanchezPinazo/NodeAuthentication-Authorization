

import { regularExps } from "../../../config";


export class RegisterUserDto {

    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
    ) {};

    static create( object: {[key: string]: any}): [ string?, RegisterUserDto? ] {
        const { name, email, password } = object;

        if ( !name ) return ["Missing Name.", undefined];
        if ( !email ) return ["Missing Email.", undefined];
        if ( !regularExps.email.test( email )) return ["Email is not valid.", undefined];
        if ( !password ) return ["Missing password.", undefined];
        if ( password.length < 6 ) return ["Password must be at least 6 characters long.", undefined];

        return [ undefined, new RegisterUserDto( name, email, password ) ];
    };
};




