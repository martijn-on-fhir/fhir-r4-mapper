import { Module } from '@nestjs/common';
import { PractitionerRoleService } from './practitioner-role.service';

@Module({
  providers: [{ provide: 'PractitionerRoleService', useClass: PractitionerRoleService }],
  exports: ['PractitionerRoleService'],
})
export class PractitionerRoleModule {}