import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { WeatherApiService } from './services/weather-api.service';
import { WeatherCitiesService } from './services/weather-cities.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [
    AppService,
    EventsGateway,
    WeatherCitiesService,
    WeatherApiService,
  ],
})
export class AppModule {}
