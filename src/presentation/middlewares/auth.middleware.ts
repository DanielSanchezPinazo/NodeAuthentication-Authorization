import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";


export class AuthMiddleware {

    static async validateJWT( req: Request, res: Response, next: NextFunction ) {

        const authorization = req.header("Authorization");

        if ( !authorization ) return res.status(401).json( {error: "No token provided."});
        if ( !authorization.startsWith("Bearer ")) return res.status(401).json( {error: "Invalid Bearer Token."});

        // en js ya se puede hacer referencia a las posiciones de un array mediante "at()"
        // at(-1) sería para hacer referencia al la última posición
        //const token = authorization.split(" ")[1];
        const token = authorization.split(" ").at(1) || "";

        try {
            
            const payload = await JwtAdapter.validateToken<{ id: string }>( token );
            if ( !payload ) return res.status(401).json( {error: "Invalid Token."});

            const user = await UserModel.findById( payload.id );
            if ( !user ) return res.status(401).json( {error: "Invalid Token - user."});

            //todo: validar si el usuario está activo

            req.body.user = UserEntity.fromObject( user );
            next();

        } catch (error) {
            
            console.log( error );
            res.status(500).json( {error: "Internal server error"} );
        };
    };

};