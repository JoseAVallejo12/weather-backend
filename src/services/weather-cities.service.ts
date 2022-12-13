import { Injectable } from '@nestjs/common';
import { WeatherApiService } from './weather-api.service';

@Injectable()
export class WeatherCitiesService {
  private cities = [];
  constructor(private readonly weatherApi: WeatherApiService) {
    setInterval(() => this.updateWeather(), 10000);
  }

  addNewCity(city: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.weatherApi
        .findCity(city)
        .then((data) => {
          this.cities.push({ ...data, name: city });
          resolve(data);
        })
        .catch((error) => {
          console.log('🚀 ~ addNewCity ~ error', error);
          reject(false);
        });
    });
  }

  getCities() {
    return this.cities;
  }

  updateWeather() {
    console.log('🚀 ~ updateWeather ~ updateWeather', this.cities);
  }

  removeAllCities() {
    this.cities = [];
  }

  removeCity(name: string) {
    this.cities = this.cities.filter((city) => city.name !== name);
  }

  cityAlreadyExist(name: string): boolean {
    return this.cities.some((city) => city.name === name);
  }
}
