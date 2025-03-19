-- CreateEnum
CREATE TYPE "Seniority" AS ENUM ('JUNIOR', 'SENIOR', 'ASSOCIATE', 'HEAD');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateofBirth" TEXT NOT NULL,
    "aadharNumber" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "seniority" "Seniority" NOT NULL,
    "aadharNumber" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proctorship" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,

    CONSTRAINT "Proctorship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryMembership" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,
    "expiryDate" TEXT NOT NULL,

    CONSTRAINT "LibraryMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_aadharNumber_key" ON "Student"("aadharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_aadharNumber_key" ON "Professor"("aadharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Proctorship_studentId_key" ON "Proctorship"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Proctorship_professorId_key" ON "Proctorship"("professorId");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryMembership_studentId_key" ON "LibraryMembership"("studentId");

-- AddForeignKey
ALTER TABLE "Proctorship" ADD CONSTRAINT "Proctorship_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proctorship" ADD CONSTRAINT "Proctorship_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryMembership" ADD CONSTRAINT "LibraryMembership_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
