import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
        {
            id: 1,
            name: 'Roast',
            brand: 'Buddy',
            flavors: ['choco', 'vanilla']
        }
    ]

    findAll() {
        return this.coffees
    }

    findOne(id: string) {
        return this.coffees.find(x => x.id === +id)
    }

    create(createCoffee) {
        this.coffees.push(createCoffee)
    }

    update(id: string, updateCoffee) {
        const existingCoffee = this.findOne(id)
        if (existingCoffee) {}
    }
    
    remove(id: string) {
        const coffeeIndex = this.coffees.findIndex(x => x.id === +id)
        if (coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1)
        }
    }
}
