-- CreateTable
CREATE TABLE "Title" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pdlCount" INTEGER NOT NULL,

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitleRelation" (
    "id" SERIAL NOT NULL,
    "titleId" INTEGER NOT NULL,
    "relatedTitleId" INTEGER NOT NULL,

    CONSTRAINT "TitleRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Title_name_key" ON "Title"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TitleRelation_titleId_relatedTitleId_key" ON "TitleRelation"("titleId", "relatedTitleId");

-- AddForeignKey
ALTER TABLE "TitleRelation" ADD CONSTRAINT "TitleRelation_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitleRelation" ADD CONSTRAINT "TitleRelation_relatedTitleId_fkey" FOREIGN KEY ("relatedTitleId") REFERENCES "Title"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
