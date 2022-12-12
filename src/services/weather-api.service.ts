import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherApiService {
  private readonly logger = new Logger(WeatherApiService.name);
  constructor(private readonly httpService: HttpService) {}

  async findCity(city: string): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<any[]>('https://weather-by-api-ninjas.p.rapidapi.com/v1/weather', {
          headers: {
            'X-RapidAPI-Key':
              '3d672ba603mshca2232c62c367d0p141c76jsna233dacaa78f',
            'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com',
          },
          params: {
            city: city,
          },
        })
        .pipe(
          catchError((error: any) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
}
/*
const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather',
  params: {city: 'Seattle'},
  headers: {
    'X-RapidAPI-Key': '3d672ba603mshca2232c62c367d0p141c76jsna233dacaa78f',
    'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});
*/
