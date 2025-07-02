import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt} from 'passport-jwt'
import { UsersService } from "src/modules/users/users.service";
import { JwtAccessToken } from "./jwt.sign";

export interface JwtPayload {
    id:string,
    username:string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey: JwtAccessToken.secret
        })
    }

    async validate(payload:JwtPayload){
        const user = await this.userService.getSingleUser(payload.id)
        if (!user) {
            throw new UnauthorizedException();
        }

        return { id: payload.id, username: payload.username, role: user.role };
    }
}