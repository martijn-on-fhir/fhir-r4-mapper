import { Module } from '@nestjs/common';
import { FlagService } from './flag.service';

@Module({
  providers: [{ provide: 'FlagService', useClass: FlagService }],
  exports: ['FlagService'],
})
export class FlagModule {}
