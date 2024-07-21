import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), AuthModule, UserModule, DocumentModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
