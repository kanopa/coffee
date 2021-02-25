import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import coffeesConfig from './config/coffees.config';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>) {
    console.log(coffeesConfiguration);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffe with ${id} not found`);
    }
    return coffee;
  }

  async create(createCoffee: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffee.flavors.map((name) => this.preloadFlavor(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffee,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffee) {
    const flavors = await Promise.all(
      updateCoffee.flavors.map((name) => this.preloadFlavor(name)),
    );
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffee,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id:${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.coffeeRepository.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffe(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction()

    try {
      coffee.recommendations++;
      const recommendEvent = new Event()
      recommendEvent.name = 'recommend_coffee'
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id};

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavor(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
