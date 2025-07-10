import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Очистка
  await prisma.review.deleteMany();
  await prisma.location.deleteMany();
  await prisma.category.deleteMany();

  // Локации
  await prisma.location.createMany({
    data: [
      { name: 'Точка на Аль-Фараби', address: 'ул. Аль-Фараби, 77', slug: 'al-farabi' },
      { name: 'Mega Center', address: 'пр. Абая, 112', slug: 'mega-center' },
      { name: 'Drive Thru Сейфуллина', address: 'ул. Сейфуллина, 39', slug: 'seifullin' },
      { name: 'Точка в Esentai Mall', address: 'пр. Аль-Фараби, 77/8', slug: 'esentai' },
      { name: 'Кафе в ТЦ Aport', address: 'ТЦ Aport, 1 этаж', slug: 'aport' },
      { name: 'Точка в Самале', address: 'ул. Навои, 25', slug: 'samal' },
      { name: 'Автоточка Жандосова', address: 'ул. Жандосова, 88', slug: 'zhandosov' },
      { name: 'Точка на Орбите', address: 'мкр. Орбита-3', slug: 'orbita' },
      { name: 'Филиал в Almaty Arena', address: 'пр. Момышулы, 5', slug: 'arena' },
      { name: 'Университетская точка', address: 'ул. Тимирязева, 42', slug: 'univer' },
    ],
  });

  // Категории
  await prisma.category.createMany({
    data: [
      { name: 'Грубое обслуживание', icon: 'alert-circle' },
      { name: 'Блюдо было холодным', icon: 'snowflake' },
      { name: 'Долго ждали заказ', icon: 'clock' },
      { name: 'Претензии к чистоте', icon: 'trash-2' },
      { name: 'Не выдали чек', icon: 'file-x' },
    ],
  });

  console.log('✅ Seed completed');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
