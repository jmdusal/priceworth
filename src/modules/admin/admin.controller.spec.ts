import { Test, TestingModule } from '@nestjs/testing';
import { AdminsController } from './admin.controller';
import { LoginService } from './login/login.service';

describe('AdminsController', () => {
    let admincontroller: AdminsController;
    let loginservice: LoginService;

    beforeEach(async () => {
        const mockLoginService: Partial<LoginService> = {
        checkImgCaptcha: async () => undefined,
        getAdminLoginSign: async () => 'mockToken',
    };

    const module: TestingModule = await Test.createTestingModule({
        controllers: [AdminsController],
        providers: [
            {
            provide: LoginService,
            useValue: mockLoginService,
            },
        ],
        }).compile();

        admincontroller = module.get<AdminsController>(AdminsController);
        loginservice = module.get<LoginService>(LoginService);
    });

    it('should be defined', () => {
        expect(admincontroller).toBeDefined();
    });

    describe('login', () => {
        it('should return a token on successful login', async () => {
        const mockDto = {
            captchaId: 'mockCaptchaId',
            verifyCode: 'mockVerifyCode',
            username: 'mockUsername',
            password: 'mockPassword',
        };

        const result = await admincontroller.login(mockDto);
        expect(result).toEqual({ token: 'mockToken' });
        });
    });

});
