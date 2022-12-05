import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    await this.pokemonModel.deleteMany({});

    /*data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');

      const no = +segments[segments.length - 2];

      await this.pokemonModel.create({ name, no });

      console.log({ name, no });
    });*/

    /*const insertPromisesArray = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');

      const no = +segments[segments.length - 2];

      insertPromisesArray.push(this.pokemonModel.create({ name, no }));

      console.log({ name, no });
    });

    await Promise.all(insertPromisesArray);*/

    const insertPokemonArray: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');

      const no = +segments[segments.length - 2];

      insertPokemonArray.push({ name, no });

      //console.log({ name, no });
    });

    this.pokemonModel.insertMany(insertPokemonArray);

    return 'Seed Executed';
  }
}
