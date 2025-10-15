// src/app.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Import these
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    // 1. Setup ConfigModule (must be the first imported module)
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available everywhere
    }),

    // 2. Setup Mongoose using ConfigService to read MONGO_URI
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    UsersModule,
    AuthModule,
    NotesModule,
  ],
})
export class AppModule {}
