import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';

@Module({
  providers: [{ provide: 'PatientService', useClass: PatientService }],
  exports: ['PatientService'],
})
export class PatientModule {}