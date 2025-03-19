import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const app = new Hono();
const prismaClient = new PrismaClient();

app.get('/', (c) => {
  return c.text('welcome to college database');
})

app.get('/students', async (c) => {
  const student = await prismaClient.student.findMany();
  return c.json({ student }, 200);
});

app.get('/students/enriched', async (c) => {

  const student = await prismaClient.student.findMany(
    {
      include: { proctorship: { include: { professor: true } } }
    });
  return c.json({ student }, 200)
});

app.get('/professors', async (c) => {
  const professors = await prismaClient.professor.findMany();
  return c.json({ professors }, 200);
});

app.post("/students", async (c) => {
  const { name, dateofBirth, aadharNumber } = await c.req.json();

  if (!name || !dateofBirth || !aadharNumber) {
    return c.json({ error: "Missing required parameters" }, 400);
  }

  const student = await prismaClient.student.create({
    data: { name,dateofBirth ,  aadharNumber }
  });
  return c.json(student, 201);
});

app.post("/professors", async (c) => {
  const { name, seniority, aadharNumber } = await c.req.json();

  if (!name || !seniority || !aadharNumber) {
    return c.json({ error: "Missing required parameters" }, 400);
  }

  const professor = await prismaClient.professor.create({
    data: { name, seniority, aadharNumber }
  });
  return c.json(professor, 201);
});

app.get('/professors/:professorId/proctorships',async (c)=>{
  
  const professorId = c.req.param("professorId");
  const students = await prismaClient.student.findMany({
    where: professorId }
  });
  return c.json(students);




})


serve(app);

console.log("server is running at http://localhost:3000")
