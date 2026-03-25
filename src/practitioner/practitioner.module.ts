import { Module } from '@nestjs/common';
import { PractitionerService } from './practitioner.service';

@Module({
  providers: [{ provide: 'PractitionerService', useClass: PractitionerService }],
  exports: ['PractitionerService'],
})
export class PractitionerModule {}