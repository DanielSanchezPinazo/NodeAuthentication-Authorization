import { validators } from '../../../config/validators';


export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string, // user ID
        public readonly category: string, // category ID
    ) {};

    static create( object: { [key: string]: any } ): [ string?, CreateProductDto? ] {

        const { name, available, price, description, user, category } = object;

        if ( !name ) return ["Missing name."];
        if ( !user ) return ["Missing user."];
        if ( !validators.isMongoID( user ) ) return ["Invalid user ID."];
        if ( !category ) return ["Missing category."];
        if ( !validators.isMongoID( category ) ) return ["Invalid category ID."]; 

        return [ undefined, new CreateProductDto( name, !!available, price, description, user, category )];
    };
};
