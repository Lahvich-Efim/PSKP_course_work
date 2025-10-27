import { PrismaClient } from '@prisma/client';
import BcryptService from '../src/common/utils/bcrypt-wrapper';

const prisma = new PrismaClient();

async function main() {
    const existing = await prisma.user.findFirst({
        where: { email: 'admin@example.com' },
    });
    if (existing) return;

    const hashedPassword = await BcryptService.hash('coor123', 10);

    const user = await prisma.user.create({
        data: {
            username: 'coor',
            email: 'coor@example.com',
            password: hashedPassword,
            role: 'COORDINATOR',
            coordinator: {
                create: {
                    name: 'Default Coordinator',
                },
            },
        },
    });

    console.log('Created default coordinator user:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .then(async () => {
        await prisma.$disconnect();
    });
