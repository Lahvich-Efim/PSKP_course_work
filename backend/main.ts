import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './src/shared/filters/global_exception_filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // app.enableCors({
    //     origin: 'http://localhost:3000',
    //     credentials: true,
    // });

    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter(app.get(Reflector)));

    const config = new DocumentBuilder()
        .setTitle('ProdCluster')
        .setVersion('1.0')
        .addBearerAuth()
        .addCookieAuth('refreshtoken')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    app.use(cookieParser());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
