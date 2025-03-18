import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";


const prisma = new PrismaClient();

async function main() {
    // Read the CSV file
    const fileContent = fs.readFileSync(path.join(__dirname, 'sample.csv'), 'utf-8');

    // Split by lines and remove the header
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    const dataLines = lines.slice(1); // Skip the header row

    // Track created titles to avoid duplicates
    const createdTitles = new Map<string | number, { name: string; id: number; pdlCount: number; }>();

    for (const line of dataLines) {
        // Split by the first two commas to get the title and pdl count
        const firstCommaIndex = line.indexOf(',');
        const title = line.substring(0, firstCommaIndex).trim();

        const secondCommaIndex = line.indexOf(',', firstCommaIndex + 1);
        const pdlCountStr = line.substring(firstCommaIndex + 1, secondCommaIndex).trim();
        const pdlCount = parseInt(pdlCountStr);

        // Get related titles (everything after the second comma)
        const relatedTitlesStr = line.substring(secondCommaIndex + 1).trim();
        const relatedTitles = relatedTitlesStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

        console.log(`Processing: ${title} with ${relatedTitles.length} related titles`);
        console.log(title, pdlCount);

        // Create or find the main title
        let mainTitle: { name: string; id: number; pdlCount: number; } | undefined;
        if (createdTitles.has(title)) {
            mainTitle = createdTitles.get(title);
        } else {
            mainTitle = await prisma.title.create({
                data: { name: title, pdlCount: pdlCount }
            });
            createdTitles.set(title, mainTitle);
        }

        // // Create or find related titles and create relationships
        for (const relatedTitle of relatedTitles) {
            // Skip empty titles
            if (!relatedTitle) continue;

            let related;
            if (createdTitles.has(relatedTitle)) {
                related = createdTitles.get(relatedTitle);
            } else {
                related = await prisma.title.create({
                    data: { name: relatedTitle, pdlCount: 0 }
                });
                createdTitles.set(relatedTitle, related);
            }

            // Create the relationship if it doesn't exist
            try {
                if (mainTitle?.id && related?.id)
                    await prisma.titleRelation.create({
                        data: {
                            titleId: mainTitle?.id,
                            relatedTitleId: related?.id
                        }
                    });
                console.log(`Created relation: ${title} -> ${relatedTitle}`);
            } catch (error) {
                // Relationship might already exist
                console.log(`Relation already exists or error: ${title} -> ${relatedTitle}`);
            }
        }
    }

    // Count the records
    const titleCount = await prisma.title.count();
    const relationCount = await prisma.titleRelation.count();

    console.log(`Database seeded successfully.`);
    console.log(`Total unique titles: ${titleCount}`);
    console.log(`Total relationships: ${relationCount}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .finally(async () => {
        await prisma.$disconnect();
    });