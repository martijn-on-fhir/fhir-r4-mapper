import { Module } from '@nestjs/common';
import { ProcedureService } from './procedure.service';

@Module({
  providers: [{ provide: 'ProcedureService', useClass: ProcedureService }],
  exports: ['ProcedureService'],
})
export class ProcedureModule {}
