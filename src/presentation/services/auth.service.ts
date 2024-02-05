import { register } from 'module';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, UserEntity } from '../../domain';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { json } from 'stream/consumers';
import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { EmailService } from './email.service';


export class AuthService {

    // Hacemos inyección de dependencoas para el email de confirmación
    constructor( 
        private readonly emailService: EmailService,
        ) {};

    public async registerUser( registerUserDto: RegisterUserDto ) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });

        if ( existUser ) throw CustomError.badRequest("Email already exists.");
        
        try {

            const user = new UserModel( registerUserDto );
            
        // Encriptar el password
            user.password = bcryptAdapter.hash( registerUserDto.password );
            
            await user.save();

        // email de confirmación
            await this.sendEmailValidationLink( user.email );

        //JWT para mantener la auteticación del usuario
            const { password, ...userEntity } = UserEntity.fromObject( user );

            const jwt = await JwtAdapter.generateToken( { id: userEntity.id } );
            if ( !jwt ) throw CustomError.internalServer("Error while creating JWT.");

            return { 
                user: userEntity, 
                token: jwt,
            };
            
        } catch ( error ) {
            throw CustomError.internalServer( `${error}` );
        };
    };

    public async loginUser( loginUserDto: LoginUserDto ) {

        // Findone para verificar si existe
        const user = await UserModel.findOne( { email: loginUserDto.email } );
        if ( !user ) throw CustomError.badRequest("Email not exists.");

        // isMatch....bcrypt.compare(123456, owuefxowucnhfñowñexfu)
        const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
        if ( !isMatching) throw CustomError.badRequest("Password is not correct.");

        const { password, ...findedUser } = UserEntity.fromObject( user );

        const jwt = await JwtAdapter.generateToken( { id: user.id, email: user.email } );    
        if ( !jwt ) throw CustomError.internalServer("Error while creating JWT.");

        return {  
           user:  findedUser , 
           token: jwt,
        };
    };

    private sendEmailValidationLink = async ( email: string ) => {
        const token = await JwtAdapter.generateToken({ email });            
        if ( !token ) throw CustomError.internalServer("Error getting token.");

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${ link }">Validate your email: ${ email }</a>
        `;

        const options = {
            to: email,
            subject: "Validate your email",
            htmlBody: html,
        };
        
        const isSent = await this.emailService.sendEmail( options );
        if ( !isSent ) throw CustomError.internalServer("Error sending email.");

        return true;
    };

    public validateEmail = async ( token: string ) => {
        const payload = await JwtAdapter.validateToken( token );
        if ( !payload ) throw CustomError.unauthorized("Invalid token.");

        const { email } = payload as { email: string };
        if ( !email ) throw CustomError.internalServer("Email not in token."); 

        const user = await UserModel.findOne( {email} );
        if ( !user ) throw CustomError.internalServer("Email not exists.");

        user.emailValidated = true;
        await user.save();

        return true;
    };
};
 
