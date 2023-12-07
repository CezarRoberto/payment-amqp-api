import { PrismaService } from '@infrastructure/database/prisma.service';
import { UserModule } from '@infrastructure/modules/user.module';
import { LoggerModule } from '@infrastructure/services/logger/logger.module';
import { EnvsModule } from '@main/envs/envs.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

const makeFakeRequest = () => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@test.com',
  },
});

describe('Create User Controller', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EnvsModule, UserModule, LoggerModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await prismaService.user.deleteMany({
      where: {
        email: {
          contains: 'test',
        },
      },
    });
  });
  test('POST /user', async () => {
    const httpRequest = makeFakeRequest();
    const response = await request(app.getHttpServer())
      .post('/user')
      .send(httpRequest.body)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: {
        email: {
          contains: 'test',
        },
      },
    });
    await app.close();
  });
});
