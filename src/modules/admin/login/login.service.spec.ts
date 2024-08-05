// import { UtilService } from './../../../shares/services/util.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { RedisService } from '@/shares/services/redis.service';
import { UtilService } from '@/shares/services/util.service';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ImageCaptchaDto } from '../dto';
import { ImageCaptcha } from './login.class';
import * as svgCaptcha from 'svg-captcha';
import { Redis } from 'ioredis';
import { isEmpty } from 'lodash';

describe('LoginService', () => {
    let loginService: LoginService;
    let redisService: RedisService;
    let utilService: UtilService;
    let jwtService: JwtService;
    let adminService: AdminService;
    let setMock = jest.fn();

    beforeEach(async () => {

        jest.mock('svg-captcha', () => ({
            create: jest.fn().mockReturnValue({
                data: '<svg>Mocked SVG Captcha</svg>',
                text: '1234',
            }),
        }));

        const module: TestingModule = await Test.createTestingModule({
        providers: [
            LoginService,
            {
                provide: RedisService,
                useValue: {
                    getRedis: jest.fn().mockReturnValue({
                        set: setMock,
                        get: jest.fn(),
                        del: jest.fn(),
                    }),
                },
            },
            {
                provide: UtilService,
                useValue: {
                    generateUUID: jest.fn().mockReturnValue('mocked_uuid'),
                },
            },
            {
                provide: JwtService,
                useValue: {
                    sign: jest.fn(),
                },
            },
            {
                provide: AdminService,
                useValue: {
                    findAdminByUserName: jest.fn(),
                    forbidden: jest.fn(),
                },
            },
        ],
        }).compile();

        loginService = module.get<LoginService>(LoginService);
        redisService = module.get<RedisService>(RedisService);
        utilService = module.get<UtilService>(UtilService);
        jwtService = module.get<JwtService>(JwtService);
        adminService = module.get<AdminService>(AdminService);

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(loginService).toBeDefined();
    });

    describe('createImageCaptcha', () => {

        it('should return an ImageCaptcha object with base64 encoded image and generated UUID', async () => {

            const captchaDto: ImageCaptchaDto = {
                width: 100,
                height: 50
            };

            // const mockedCaptchaValue = '1234';
            // const mockedCaptchaObj = { text: mockedCaptchaValue };
            // jest.spyOn(svgCaptcha, 'create').mockReturnValue(mockedCaptchaObj);

            const result = await loginService.createImageCaptcha(captchaDto);

            expect(result).toHaveProperty('img');
            expect(result).toHaveProperty('id');
            expect(result.img).toMatch(/^data:image\/svg\+xml;base64,/);
            expect(result.id).toBe('mocked_uuid');

            // expect(setMock).toHaveBeenCalledWith(
            //     `admin:captcha:img:mocked_uuid`,
            //     // mockedCaptchaObj.text,
            //     '1234',
            //     'EX',
            //     60 * 5
            // );

            expect(result).toEqual({
                img: expect.any(String),
                id: 'mocked_uuid'
            });
        });




        // it('should return an ImageCaptcha object with base64 encoded image and generated UUID', async () => {
        //     const captchaDto: ImageCaptchaDto = {
        //         width: 100,
        //         height: 50
        //     };

        //     const result = await loginService.createImageCaptcha(captchaDto);

        //     expect(result).toHaveProperty('img');
        //     expect(result).toHaveProperty('id');
        //     expect(result.img).toMatch(/^data:image\/svg\+xml;base64,/);
        //     expect(result.id).toBe('mocked_uuid');
        //     expect(setMock).toHaveBeenCalledWith(
        //         `admin:captcha:img:mocked_uuid`,
        //         '1234',
        //         'EX',
        //         60 * 5
        //     );
        // });

    });



    describe('getAdminLoginSign', () => {

        it('should return JWT token if username and password are correct', async () => {
            const mockAdmin = { id: 1, username:'asdasd', password: 'password' };
            const mockJwtToken = 'mockJwtToken';

            jest.spyOn(adminService, 'findAdminByUserName').mockResolvedValue(mockAdmin);
            jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtToken);

            const token = await loginService.getAdminLoginSign('username', 'password');

            expect(token).toEqual(mockJwtToken);
            expect(redisService.getRedis().set).toHaveBeenCalledWith(
              `admin:token:${mockAdmin.id}`,
              mockJwtToken,
              'EX',
              60 * 60 * 24,
            );
        });

        it('should throw UnauthorizedException if admin account not found', async () => {
            jest.spyOn(adminService, 'findAdminByUserName').mockResolvedValue(null);

            await expect(loginService.getAdminLoginSign('nonExistingUsername', 'password')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            const mockAdmin = { id: 1, username: 'asdsadsa', password: 'incorrect-password' };
            jest.spyOn(adminService, 'findAdminByUserName').mockResolvedValue(mockAdmin);

            await expect(loginService.getAdminLoginSign('username', 'wrongPassword')).rejects.toThrow(UnauthorizedException);
        });




        // it('should admin login sign', async () => {

        //     const username = 'testUser';
        //     const password = 'testPassword';
        //     const mockAdmin = { id: 1, username:'test', password: 'testPassword' };

        //     jest.spyOn(adminService, 'findAdminByUserName').mockResolvedValue(mockAdmin);
        //     jest.spyOn(jwtService, 'sign').mockReturnValue('mockedJWT');

        //     const mockSet = jest.fn();
        //     const mockRedis: Redis = {
        //         options: {},
        //         status: 'connect',
        //         stream: {},
        //         isCluster: false,
        //         set: mockSet,
        //     };

        //     jest.spyOn(redisService, 'getRedis').mockReturnValue(mockRedis);

        //     const result = await loginService.getAdminLoginSign(username, password);

        //     expect(result).toBe('mockedJWT');
        //     expect(svgCaptcha.create).toHaveBeenCalled();
        //     expect(adminService['adminService'].findAdminByUserName).toHaveBeenCalledWith(username);
        //     expect(jwtService['jwtService'].sign).toHaveBeenCalledWith({ uid: mockAdmin.id, role: 'ADMIN_USER' });
        //     expect(mockSet).toHaveBeenCalledWith(`admin:token:${mockAdmin.id}`, 'mockedJWT', 'EX', 86400);

        // });













        // it('should create an image captcha', async () => {
        //     const mockCaptcha = { width: 100, height: 50 };
        //     const mockId = 'mockId';
        //     const isRed = true;
        //     const textColor = isRed ? 'red' : 'black';

        //     const mockSvg = { data: '<svg>Mocked SVG Captcha</svg>', text: 'Mocked Text' };
        //     const result = await loginService.createImageCaptcha(mockCaptcha);
        //     const expectedResult = {
        //         img: `data:image/svg+xml;base64,${Buffer.from(mockSvg.data).toString('base64')}`,
        //         id: mockId,
        //     };

        //     const mockGenerateUUID = jest.fn().mockReturnValue(mockId);
        //     loginService['util']['generateUUID'] = mockGenerateUUID;

        //     const mockSet = jest.fn().mockResolvedValue(true);
        //     const mockGetRedis = jest.fn().mockReturnValue({ set: mockSet });
        //     const mockRedisService = { getRedis: mockGetRedis };
        //     loginService['redisService'] = mockRedisService as any;

        //     // expect(svgCaptcha.create).toHaveBeenCalledWith({
        //     //     size: 4,
        //     //     color: textColor,
        //     //     noise: 4,
        //     //     width: 100,
        //     //     height: 50,
        //     //     charPreset: '1234567890',
        //     // });
        //     expect(createMock).toHaveBeenCalledWith({
        //         size: 4,
        //         color: textColor,
        //         noise: 4,
        //         width: 100,
        //         height: 50,
        //         charPreset: '1234567890',
        //     });
        //     expect(result).toEqual(expectedResult);
        //     expect(mockGenerateUUID).toHaveBeenCalled();
        //     expect(mockGetRedis).toHaveBeenCalled();
        //     expect(mockSet).toHaveBeenCalledWith(
        //         `admin:captcha:img:${mockId}`,
        //         mockSvg.text,
        //         'EX',
        //         60 * 5
        //     );
        // });

    });


    describe('checkImgCaptcha', () => {

        it('should successfully verify the captcha', async () => {
            const mockId = 'mockId';
            const mockCode = '1234';
            const mockStoredCode = '1234';
            jest.spyOn(redisService.getRedis(), 'get').mockResolvedValue(mockStoredCode);

            await loginService.checkImgCaptcha(mockId, mockCode);

            expect(redisService.getRedis().get).toHaveBeenCalledWith(`admin:captcha:img:${mockId}`);
            expect(redisService.getRedis().del).toHaveBeenCalledWith(`admin:captcha:img:${mockId}`);
        });

        it('should throw BadRequestException if captcha code is invalid', async () => {
            const mockId = 'mockId';
            const mockCode = '5678';
            const mockStoredCode = '1234';
            jest.spyOn(redisService.getRedis(), 'get').mockResolvedValue(mockStoredCode);

            await expect(loginService.checkImgCaptcha(mockId, mockCode)).rejects.toThrow(BadRequestException);

            expect(redisService.getRedis().get).toHaveBeenCalledWith(`admin:captcha:img:${mockId}`);
            expect(redisService.getRedis().del).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException if captcha is expired', async () => {
            const mockId = 'expiredId';
            const mockCode = '1234';
            jest.spyOn(redisService.getRedis(), 'get').mockResolvedValue(null);

            await expect(loginService.checkImgCaptcha(mockId, mockCode)).rejects.toThrow(BadRequestException);

            expect(redisService.getRedis().get).toHaveBeenCalledWith(`admin:captcha:img:${mockId}`);
            expect(redisService.getRedis().del).not.toHaveBeenCalled();
        });

    });


    describe('clearLoginStatus', () => {

        it('should clear login status', async () => {
            const mockUid = 1;
            await loginService.clearLoginStatus(mockUid);
            expect(adminService.forbidden).toHaveBeenCalledWith(mockUid);
        });

    });


    describe('getRedisPasswordVersionById', () => {

        it('should get password version from Redis', async () => {
            const mockId = 1;
            const mockPasswordVersion = 'mockPasswordVersion';
            jest.spyOn(redisService.getRedis(), 'get').mockResolvedValue(mockPasswordVersion);

            const result = await loginService.getRedisPasswordVersionById(mockId);
            expect(result).toEqual(mockPasswordVersion);
            expect(redisService.getRedis().get).toHaveBeenCalledWith(`admin:passwordVersion:${mockId}`);
        });

    });


    describe('getRedisTokenById', () => {

        it('should get token from Redis', async () => {
            const mockId = 1;
            const mockToken = 'mockToken';
            jest.spyOn(redisService.getRedis(), 'get').mockResolvedValue(mockToken);

            const result = await loginService.getRedisTokenById(mockId);
            expect(result).toEqual(mockToken);
            expect(redisService.getRedis().get).toHaveBeenCalledWith(`admin:token:${mockId}`);
        });

    });


    describe('getRedisPermsById', () => {

        it('should get permissions from Redis', async () => {
            const mockId = 1;
            const mockPerms = 'mockPerms';
            jest.spyOn(redisService.getRedis(), 'get').mockResolvedValue(mockPerms);

            const result = await loginService.getRedisPermsById(mockId);
            expect(result).toEqual(mockPerms);
            expect(redisService.getRedis().get).toHaveBeenCalledWith(`admin:perms:${mockId}`);
        });

    });

});
