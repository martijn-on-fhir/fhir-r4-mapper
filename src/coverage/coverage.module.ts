import { Module } from '@nestjs/common';
import { CoverageService } from './coverage.service';

@Module({
  providers: [{ provide: 'CoverageService', useClass: CoverageService }],
  exports: ['CoverageService'],
})
export class CoverageModule {}
