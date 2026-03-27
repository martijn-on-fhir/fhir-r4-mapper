import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TerminologyService } from './terminology.service';
import { TerminologyProcessor } from './terminology.processor';

@Global()
@Module({
  imports: [BullModule.registerQueue({ name: 'terminology' })],
  providers: [TerminologyService, TerminologyProcessor],
  exports: [TerminologyService],
})
export class TerminologyModule {}
