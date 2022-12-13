import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WeatherCitiesService } from '../services/weather-cities.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection {
  constructor(private weatherCities: WeatherCitiesService) {}
  @WebSocketServer() server: Server;

  handleConnection(client: any, ...args: any[]) {
    this.server.emit('cities', this.weatherCities.getCities());
    console.log('🚀 ~ handleConnection ~ client connected', client.id);
  }

  @SubscribeMessage('removeCity')
  removeCity(@MessageBody() data: string) {
    this.weatherCities.removeCity(data.toLowerCase());
    this.server.emit('cities', this.weatherCities.getCities());
  }

  @SubscribeMessage('removeAllCities')
  removeAllCities() {
    console.log('🚀 ~ removeAllCities ~ removeAllCities');
    this.weatherCities.removeAllCities();
    this.server.emit('cities', this.weatherCities.getCities());
  }

  @SubscribeMessage('cities')
  getCities(): WsResponse {
    return { event: 'cities', data: this.weatherCities.getCities() };
  }

  @SubscribeMessage('search')
  handleEvent(@MessageBody() data: string) {
    const cityName = data.toLowerCase();
    if (!this.weatherCities.cityAlreadyExist(cityName)) {
      this.weatherCities
        .addNewCity(cityName)
        .then(() => {
          this.server.emit('cities', this.weatherCities.getCities());
        })
        .catch(() => {
          this.server.emit('error', 'City not found');
        });
    } else {
      this.server.emit('error', 'City already exist');
    }
  }
}
