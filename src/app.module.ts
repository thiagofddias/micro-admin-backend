import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://thiagofdias2:eDMr2a5byleD2RFL@cluster.cjc37.mongodb.net/sradmbackend?retryWrites=true&w=majority&appName=Cluster',
    ),
    CategoriesModule,
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
