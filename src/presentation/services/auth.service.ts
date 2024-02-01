import { register } from 'module';
import { UserModel } from '../../data';
import { CustomError, UserEntity } from '../../domain';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { json } from 'stream/consumers';
import { bcryptAdapter } from '../../config';


export class AuthService {

    constructor() {};

    public async registerUser( registerUserDto: RegisterUserDto ) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });

        if ( existUser ) throw CustomError.badRequest("Email already exists.");
        
        try {

            const user = new UserModel( registerUserDto );
            
             // Encriptar el password
            user.password = bcryptAdapter.hash( registerUserDto.password );
            
            await user.save();

            //JWT para mantener la auteticación del usuario

            // email de confirmación
            const { password, ...userEntity } = UserEntity.fromObject( user );

            return { 
                user: userEntity, 
                token: "ABC"
            };
            
        } catch ( error ) {
            throw CustomError.internalServer( `${error}` );
        };
    };
};
 
