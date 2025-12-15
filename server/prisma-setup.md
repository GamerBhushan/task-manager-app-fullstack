To Make Prisma Migrations
npx prisma migrate dev --name init

To Remove 
1st Delete
Delete the local migration files: Remove the migrations folder from your prisma directory.
bash

# For Windows, you might use: rmdir /s /q prisma\migrations
npx prisma migrate reset --force
