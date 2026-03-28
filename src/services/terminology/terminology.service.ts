import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Queue } from 'bullmq';

/**
 * Service for resolving terminology codes to their display values.
 *
 * Uses a cache-first strategy: if a display value is cached it is returned immediately,
 * otherwise a background lookup job is queued via BullMQ and the fallback value is returned.
 */
@Injectable()
export class TerminologyService {

  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @InjectQueue('terminology') private terminologyQueue: Queue,
  ) {}

  /**
   * Looks up the display value for a SNOMED CT code.
   * @param code - The SNOMED CT concept code.
   * @param fallback - Value returned when the display is not yet cached.
   * @returns The cached display value, or the fallback.
   */
  async lookupSnomedSct(code: string, fallback = ''): Promise<string> {
    return this.lookup('http://snomed.info/sct', code, fallback);
  }

  async lookupLoinc(code: string, fallback = ''): Promise<string> {
    return this.lookup('http://loinc.org', code, fallback);
  }

  /**
   * Looks up the display value for a code in the given terminology system.
   *
   * Returns the cached display value when available. If not cached, a background
   * job is enqueued to resolve the code and the fallback value is returned.
   * @param system - The terminology system URI (e.g. `http://snomed.info/sct`).
   * @param code - The code to look up.
   * @param fallback - Value returned when the display is not yet cached.
   * @returns The cached display value, or the fallback.
   */
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
