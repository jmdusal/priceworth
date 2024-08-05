import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { RedisService } from '@/shares/services/redis.service';

describe('AdminService', () => {
    let adminservice: AdminService;
    let redisServiceMock: Partial<RedisService>;

    beforeEach(async () => {
        redisServiceMock = {
        getRedis: jest.fn().mockReturnValue({
            del: jest.fn(),
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
        providers: [
            AdminService,
            {
            provide: RedisService,
            useValue: redisServiceMock,
            },
        ],
    }).compile();

    adminservice = module.get<AdminService>(AdminService);
    });

    it('should be defined', () => {
        expect(adminservice).toBeDefined();
    });


    describe('findAdminByUserName', () => {
        it('should return admin object if username exists', async () => {
            const admin = await adminservice.findAdminByUserName(process.env.ADMIN_USERNAME);
            expect(admin).toBeDefined();
            expect(admin.id).toEqual(1);
            expect(admin.username).toEqual(process.env.ADMIN_USERNAME);
            expect(admin.password).toEqual(process.env.ADMIN_PASSWORD);
        });

        it('should return undefined if username does not exist', async () => {
            const admin = await adminservice.findAdminByUserName('nonexistent_username');
            expect(admin).toBeUndefined();
        });
    });

    describe('forbidden', () => {
        it('should delete admin session', async () => {
            const adminId = 1;
            await adminservice.forbidden(adminId);
            expect(redisServiceMock.getRedis().del).toHaveBeenCalledWith(`admin:token:${adminId}`);
        });
    });

});
