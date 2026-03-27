import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Queue } from 'bullmq';

@Injectable()
export class TerminologyService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectQueue('terminology') private terminologyQueue: Queue,
  ) {}

  async lookupSnomedSct(code: string, fallback = ''): Promise<string> {
    return this.lookup('http://snomed.info/sct', code, fallback);
  }

  async lookup(system: string, code: string, fallback = ''): Promise<string> {
    const cacheKey = `terminology:${system}|${code}`;

    const cached = await this.cache.get<string>(cacheKey);
    if (cached) return cached;

    await this.terminologyQueue.add('lookup', { system, code: `${code}` }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeDependencyOnFailure: true,
    });

    return fallback;
  }
}
