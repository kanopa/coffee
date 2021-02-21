import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeS: CoffeesService) {}

  @Get()
  allCoffees() {
    return this.coffeeS.findAll();
  }

  @Get(':id')
  getOneCoffee(@Param('id') id: number) {
    return this.coffeeS.findOne(id);
  }

  @Post()
  createCoffee(@Body() createCoffee: CreateCoffeeDto) {
    console.log(createCoffee instanceof CreateCoffeeDto);
    return this.coffeeS.create(createCoffee);
  }

  @Patch(':id')
  updateCoffee(@Param('id') id: number, @Body() updateCoffee: UpdateCoffeeDto) {
    return this.coffeeS.update(id, updateCoffee);
  }

  @Delete(':id')
  deleteCoffee(@Param('id') id: number) {
    return this.coffeeS.remove(id);
  }
}
