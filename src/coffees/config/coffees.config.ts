import { registerAs } from "@nestjs/config";

 export default registerAs('coffees', () => ({
     hello: 'world'
 }));