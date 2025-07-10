import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Req,
  Param,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Отзывы')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Скачать отзыв в PDF' })
  @ApiResponse({ status: 200, description: 'PDF-файл жалобы' })
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const review = await this.reviewsService.findById(id);
    if (!review) {
      throw new NotFoundException('Отзыв не найден');
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=review-${id}.pdf`);
    doc.pipe(res);

    // ✅ Подключаем шрифт для кириллицы
    const fontPath = join(process.cwd(), 'assets', 'fonts', 'Roboto-Regular.ttf');
    if (fs.existsSync(fontPath)) {
      doc.registerFont('Roboto', fontPath);
      doc.font('Roboto');
    }

    // 📄 Контент PDF
    doc.fontSize(20).text('Жалоба (SalamBro)', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Точка: ${review.location.name}`);
    doc.text(`Категория: ${review.category.name}`);
    doc.text(`Дата: ${review.createdAt.toLocaleString()}`);
    if (review.comment) {
      doc.moveDown();
      doc.text(`Комментарий:\n${review.comment}`);
    }

    // 📷 Вставка фото
    const burgerPath = join(__dirname, '..', '..', '..', review.photoBurgerUrl.replace(/^\//, ''));

    if (fs.existsSync(burgerPath)) {
      doc.image(burgerPath, { width: 250 }).moveDown();
      doc.moveDown().text('Фото бургера:');
      doc.image(burgerPath, { width: 250 }).moveDown();
    } else {
      doc.text('Фото бургера не найдено').moveDown();
    }

    const receiptPath = join(__dirname, '..', '..', '..', review.photoReceiptUrl.replace(/^\//, ''));
    if (fs.existsSync(receiptPath)) {
      doc.text('Фото чека:');
      doc.image(receiptPath, { width: 250 });
    }

    doc.end();
  }

  @Post()
  @ApiOperation({ summary: 'Создать отзыв с фото чека и бургера' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        locationId: { type: 'string', format: 'uuid' },
        categoryId: { type: 'string', format: 'uuid' },
        phone: { type: 'string'},
        comment: { type: 'string' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['locationId', 'categoryId', 'files', 'phone'],
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4() + extname(file.originalname);
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateReviewDto,
    @Req() req: any,
  ) {
    if (files.length !== 2) {
      throw new BadRequestException('Нужно загрузить 2 файла: бургер и чек');
    }
    const [photoBurger, photoReceipt] = files;
    return this.reviewsService.createReview(
      dto,
      `/uploads/${photoBurger.filename}`,
      `/uploads/${photoReceipt.filename}`,
      req.ip,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Получить все отзывы' })
  async findAll() {
    return this.reviewsService.findAll();
  }
}
