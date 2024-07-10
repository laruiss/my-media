/*
  Warnings:

  - You are about to drop the `_LabelToMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LabelToMovie" DROP CONSTRAINT "_LabelToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_LabelToMovie" DROP CONSTRAINT "_LabelToMovie_B_fkey";

-- DropTable
DROP TABLE "_LabelToMovie";

-- CreateTable
CREATE TABLE "MovieLabel" (
    "movieId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,

    CONSTRAINT "MovieLabel_pkey" PRIMARY KEY ("movieId","labelId")
);

-- AddForeignKey
ALTER TABLE "MovieLabel" ADD CONSTRAINT "MovieLabel_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieLabel" ADD CONSTRAINT "MovieLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
