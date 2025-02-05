import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
    async signup(dto: AuthDto){
        try{
            // generate hash
            const hash = await argon.hash(dto.password)
            // save new user
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash
                }
            })
            // return the token
            return this.signToken(user.id, user.email)
        }catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials Taken')
                }
            }else{
                throw error
            }
        }
    }
    
    async signin(dto: AuthDto){
        try{
            // find user
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email
                }
            })

            // if not found throw error
            if (!user) throw new ForbiddenException('Credentials incorrect')
            // compare password

            const pwMatches = await argon.verify(user.password, dto.password)
            // if incorect throw error
            if(!pwMatches) throw new ForbiddenException('Credentials incorrect')
            // send back token
            return this.signToken(user.id, user.email)
        }catch(error){
            throw error
        }
    }

    refresh(){}

    async signToken(userId:number, email:string):Promise<{access_token:string, status:HttpStatus}>{
        const payload = {
            sub: userId,
            email: email
        }

        const secret = this.config.get("JWT_SECRET")

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        })

        return {
           access_token: token,
           status: HttpStatus.OK,
        }
    }

}
