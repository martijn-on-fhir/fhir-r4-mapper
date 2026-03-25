import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Module({
  providers: [{ provide: 'OrganizationService', useClass: OrganizationService }],
  exports: ['OrganizationService'],
})
export class OrganizationModule {}
