import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const app = new Hono();
const prismaClient = new PrismaClient();

app.get('/', (c) => {
  return c.text('welcome to college database');
})

app.get('/student',(c)=>{
const student = prismaClient.student.findMany();
return c.json({student},200)

})



serve(app);

console.log("server is running at http://localhost:3000")
