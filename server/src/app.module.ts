import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/databaseConfig';

const test = () => configuration;
@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({ load: [test] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
