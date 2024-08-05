import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { ImageCaptchaDto } from '../dto';
import { ImageCaptcha } from './login.class';
import { UtilService } from '@/shares/services/util.service';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin.service';
import { RedisService } from '@/shares/services/redis.service';

describe('LoginController', () => {
    let loginController: LoginController;
    let loginService: LoginService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginController],
            providers: [
                LoginService,
                {
                    provide: RedisService,
                    useValue: {
                        getRedis: jest.fn().mockReturnValue({
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

        loginController = module.get<LoginController>(LoginController);
        loginService = module.get<LoginService>(LoginService);
    });

    it('should be defined', () => {
        expect(loginController).toBeDefined();
    });

    describe('captchaByImg', () => {
        it('should return an ImageCaptcha', async () => {

            const imageCaptchaDto: ImageCaptchaDto = {
                width: 100,
                height: 50
            };
            const mockImageCaptcha: ImageCaptcha = {
                img: 'mocked_image_data',
                id: 'mocked_id'
            };
            jest.spyOn(loginService, 'createImageCaptcha').mockResolvedValue(mockImageCaptcha);

            const result = await loginController.captchaByImg(imageCaptchaDto);

            expect(result).toEqual(mockImageCaptcha);
        });

        it('should handle error an ImageCaptcha', async () => {
            const imageCaptchaDto: ImageCaptchaDto = {
                width: 100,
                height: 50
            };
            const mockError = new Error('Failed to create image captcha');
            jest.spyOn(loginService, 'createImageCaptcha').mockRejectedValue(mockError);

            try {
                await loginController.captchaByImg(imageCaptchaDto);
            } catch (error) {
                expect(error).toEqual(mockError);
            }
        });

    });


});
