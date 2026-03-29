import { Test, TestingModule } from '@nestjs/testing';
import { PractitionerRoleService } from './practitioner-role.service';

describe('PractitionerRoleService', () => {
  let service: PractitionerRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PractitionerRoleService],
    }).compile();

    service = module.get<PractitionerRoleService>(PractitionerRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
