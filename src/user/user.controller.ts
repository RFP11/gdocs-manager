import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(){}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() req){
        console.log(req)
        return 'User Info'
    }
}
