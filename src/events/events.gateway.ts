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
    this.weatherCities.removeCity(data);
    this.server.emit('cities', this.weatherCities.getCities());
  }

  @SubscribeMessage('cities')
  getCities(): WsResponse {
    return { event: 'cities', data: this.weatherCities.getCities() };
  }

  @SubscribeMessage('search')
  handleEvent(@MessageBody() data: string) {
    this.weatherCities.addNewCity(data).then(() => {
      this.server.emit('cities', this.weatherCities.getCities());
    });
  }
}
