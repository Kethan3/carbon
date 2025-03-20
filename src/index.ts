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
    where: { proctorship: { professorId } },
  });
  return c.json(students);
});

app.patch("/students/:studentId", async (c) => {
  const studentId = c.req.param("studentId");
  const { name, dateofBirth, aadharNumber } = await c.req.json();
  const updatedStudent = await prismaClient.student.update({
    where: { id: studentId },
    data: { name, dateofBirth, aadharNumber },
  });
  return c.json(updatedStudent);
});

app.patch("/professors/:professorId", async (c) => {
  const professorId = c.req.param("professorId");
  const { name, seniority, aadharNumber } = await c.req.json();
  const updatedProfessor = await prismaClient.professor.update({
    where: { id: professorId },
    data: { name, seniority, aadharNumber },
  });
  return c.json(updatedProfessor);
});

app.delete("/students/:studentId", async (c) => {
  const studentId = c.req.param("studentId");
  await prismaClient.student.delete({ where: { id: studentId } });
  return c.json({ message: "Student deleted successfully" });
});

app.delete("/professors/:professorId", async (c) => {
  const professorId = c.req.param("professorId");
  await prismaClient.professor.delete({ where: { id: professorId } });
  return c.json({ message: "Professor deleted successfully" });
});

app.post("/professors/:professorId/proctorships", async (c) => {
  const professorId = c.req.param("professorId");
  const { studentId } = await c.req.json();
  const proctorship = await prismaClient.proctorship.create({
    data: { studentId, professorId },
  });
  return c.json(proctorship);
});

app.get("/students/:studentId/library-membership", async (c) => {
  const studentId = c.req.param("studentId");
  const membership = await prismaClient.libraryMembership.findUnique({
    where: { studentId },
  });
  return c.json(membership);
});

app.post("/students/:studentId/library-membership", async (c) => {
  const studentId = c.req.param("studentId");
  const { issueDate, expiryDate } = await c.req.json();
  const membership = await prismaClient.libraryMembership.create({
    data: { studentId, issueDate, expiryDate },
  });
  return c.json(membership);
});


app.patch("/students/:studentId/library-membership", async (c) => {
  const studentId = c.req.param("studentId");
  const { issueDate, expiryDate } = await c.req.json();
  const updatedMembership = await prismaClient.libraryMembership.update({
    where: { studentId },
    data: { issueDate, expiryDate },
  });
  return c.json(updatedMembership);
});


app.delete("/students/:studentId/library-membership", async (c) => {
  const studentId = c.req.param("studentId");
  await prismaClient.libraryMembership.delete({ where: { studentId } });
  return c.json({ message: "Library membership deleted successfully" });
});


serve(app);

console.log("server is running at http://localhost:3000");
