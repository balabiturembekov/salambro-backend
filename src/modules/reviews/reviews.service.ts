import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        location: true,
        category: true,
      },
    });
  }
  

  async createReview(
    createReviewDto: CreateReviewDto,
    burgerUrl: string,
    receiptUrl: string,
    ipAddress: string,
  ) {
    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        comment: createReviewDto.comment || '',
        photoBurgerUrl: burgerUrl,
        photoReceiptUrl: receiptUrl,
        ipAddress,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        location: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
