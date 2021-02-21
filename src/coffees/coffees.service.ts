import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Roast',
      brand: 'Buddy',
      flavors: ['choco', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: number) {
    const coffee = this.coffees.find((x) => x.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffe with ${id} not found`);
    }
    return coffee;
  }

  create(createCoffee) {
    this.coffees.push(createCoffee);
    return createCoffee;
  }

  update(id: number, updateCoffee) {
    // const existingCoffee = this.findOne(id);
    // if (existingCoffee) {}
  }

  remove(id: number) {
    const coffeeIndex = this.coffees.findIndex((x) => x.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
