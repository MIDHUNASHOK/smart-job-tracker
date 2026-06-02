-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "job_Title" TEXT NOT NULL,
    "company_Name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "job_Type" TEXT NOT NULL,
    "work_mode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "applied_Date" TIMESTAMP(3) NOT NULL,
    "job_Url" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
