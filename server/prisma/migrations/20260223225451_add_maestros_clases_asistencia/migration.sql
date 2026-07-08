-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nombreAlumno" TEXT;

-- CreateTable
CREATE TABLE "clases" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "maestroId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clase_alumnos" (
    "id" TEXT NOT NULL,
    "claseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "clase_alumnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asistencias" (
    "id" TEXT NOT NULL,
    "claseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clase_alumnos_claseId_userId_key" ON "clase_alumnos"("claseId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "asistencias_claseId_userId_fecha_key" ON "asistencias"("claseId", "userId", "fecha");

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_maestroId_fkey" FOREIGN KEY ("maestroId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clase_alumnos" ADD CONSTRAINT "clase_alumnos_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "clases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clase_alumnos" ADD CONSTRAINT "clase_alumnos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "clases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
