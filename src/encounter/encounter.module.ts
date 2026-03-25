import { Module } from '@nestjs/common';
import { EncounterService } from './encounter.service';

@Module({
  providers: [{ provide: 'EncounterService', useClass: EncounterService }],
  exports: ['EncounterService'],
})
export class EncounterModule {}