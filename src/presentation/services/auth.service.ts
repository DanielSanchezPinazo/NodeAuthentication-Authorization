import { register } from 'module';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, UserEntity } from '../../domain';
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

    public async loginUser( loginUserDto: LoginUserDto ) {

        // Findone para verificar si existe
        const user = await UserModel.findOne( {email: loginUserDto.email} );
        if ( !user ) throw CustomError.badRequest("Email not exists.");

        // isMatch....bcrypt.compare(123456, owuefxowucnhfñowñexfu)
        const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
        if ( !isMatching) throw CustomError.badRequest("Password is not correct.");

        const { password, ...findedUser } = UserEntity.fromObject( user );

        return {  
           user:  findedUser , 
           token: "ABC",
        };
    };
};
 
