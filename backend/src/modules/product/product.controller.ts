import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Query,
    Body,
    Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
    PaginatedResponseDto,
    PaginationDto,
} from '../../shared/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { CurrentUser } from '../../shared/decorators/current_user.decorator';
import { UserData } from '../users/user.entity';

const PaginatedProductDto = PaginatedResponseDto(ProductResponseDto);

@Controller('products')
export class ProductController {
    constructor(private readonly productsService: ProductService) {}

    @Get()
    async getActualityProducts(
        @Query() params: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<InstanceType<typeof PaginatedProductDto>> {
        const { offset, limit } = params;
        return this.productsService.getActualProducts(user, offset, limit);
    }

    @Get(':id')
    async getActualityProduct(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<ProductResponseDto> {
        return this.productsService.getActualProduct(id, user);
    }

    @Post()
    async createProduct(
        @Body() params: CreateProductDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductResponseDto> {
        return this.productsService.createProduct(params, user);
    }

    @Patch(':id')
    async updateProduct(
        @Param('id') id: number,
        @Body() dto: UpdateProductDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductResponseDto> {
        return this.productsService.updateProduct({ id, ...dto }, user);
    }

    @Delete(':id')
    async deleteProduct(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<ProductResponseDto> {
        return this.productsService.deleteProduct(id, user);
    }
}
