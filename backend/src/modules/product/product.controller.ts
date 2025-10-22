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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const PaginatedProductDto = PaginatedResponseDto(ProductResponseDto);

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(private readonly productsService: ProductService) {}

    @Get()
    @ApiOperation({ summary: 'Get all actual products' })
    @ApiOkResponse({
        description: 'Successfully retrieved actual products',
        type: PaginatedProductDto,
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async getActualityProducts(
        @Query() params: PaginationDto,
        @CurrentUser() user: UserData,
    ): Promise<InstanceType<typeof PaginatedProductDto>> {
        const { offset, limit } = params;
        return this.productsService.getProducts(user, offset, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an actual product by ID' })
    @ApiOkResponse({
        description: 'Successfully retrieved actual product',
        type: ProductResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Product not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async getActualityProduct(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<ProductResponseDto> {
        return this.productsService.getProduct(id, user);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiCreatedResponse({
        description: 'The product has been successfully created.',
        type: ProductResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async createProduct(
        @Body() params: CreateProductDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductResponseDto> {
        return this.productsService.createProduct(params, user);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing product' })
    @ApiOkResponse({
        description: 'The product has been successfully updated.',
        type: ProductResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Product not found' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async updateProduct(
        @Param('id') id: number,
        @Body() dto: UpdateProductDto,
        @CurrentUser() user: UserData,
    ): Promise<ProductResponseDto> {
        return this.productsService.updateProduct({ id, ...dto }, user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiOkResponse({
        description: 'The product has been successfully deleted.',
        type: ProductResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Product not found' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Access Denied' })
    async deleteProduct(
        @Param('id') id: number,
        @CurrentUser() user: UserData,
    ): Promise<ProductResponseDto> {
        return this.productsService.deleteProduct(id, user);
    }
}
