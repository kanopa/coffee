import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeeS: CoffeesService) {}

    @Get()
    allCoffees() {
        return this.coffeeS.findAll()
    }

    @Get(':id')
    getOneCoffee(@Param('id') id : string) {
        return this.coffeeS.findOne(id)
    }

    @Post()
    createCoffee(@Body() body) {
        return this.coffeeS.create(body)
    }

    @Patch(':id')
    updateCoffee(@Param('id') id: string, @Body() body) {
       return this.coffeeS.update(id, body)
    }

    @Delete(':id')
    deleteCoffee(@Param('id') id: string) {
        return this.coffeeS.remove(id)
    }
}
