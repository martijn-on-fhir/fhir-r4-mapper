import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Job } from 'bullmq';
import * as _ from 'lodash';

@Processor('terminology')
export class TerminologyProcessor extends WorkerHost {
  private readonly logger = new Logger(TerminologyProcessor.name);
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;
  private readonly loincUsername: string;
  private readonly loincPassword: string;
  private accessToken: string;

  constructor(
    private config: ConfigService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {
    super();
    this.baseUrl = this.config.get('TERMINOLOGY_BASE_URL');
    this.username = this.config.get('TERMINOLOGY_USERNAME');
    this.password = this.config.get('TERMINOLOGY_PASSWORD');
    this.loincUsername = this.config.get('LOINC_USERNAME');
    this.loincPassword = this.config.get('LOINC_PASSWORD');
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    const body = new URLSearchParams({
      username: this.username,
      password: this.password,
      client_id: 'cli_client',
      grant_type: 'password',
    });

    const response = await fetch(
      `${this.baseUrl}/authorisation/auth/realms/nictiz/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      },
    );

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;

    return this.accessToken;
  }

  async process(job: Job<{ system: string; code: string }>): Promise<string | null> {
    const { system, code } = job.data;
    const cacheKey = `terminology:${system}|${code}`;

    const response = system === 'http://loinc.org'
      ? await this.fetchLoinc(code)
      : await this.fetchNictiz(system, code);

    if (!response.ok) {
      this.logger.warn(`Lookup failed for ${cacheKey}: ${response.status}`);

      return null;
    }

    const data = await response.json();
    const display = _.find(data.parameter, { name: 'display' })?.valueString ?? null;
    this.logger.log(`Lookup result for ${cacheKey}: ${display}`);

    if (display) {
      await this.cache.set(cacheKey, display);
      this.logger.log(`Cached ${cacheKey} = ${display}`);
    }

    return display;
  }

  private async fetchLoinc(code: string): Promise<Response> {
    const url = `https://fhir.loinc.org/CodeSystem/$lookup?system=http://loinc.org&code=${encodeURIComponent(code)}&displayLanguage=nl`;
    const credentials = Buffer.from(`${this.loincUsername}:${this.loincPassword}`).toString('base64');

    return fetch(url, {
      headers: {
        Accept: 'application/fhir+json',
        Authorization: `Basic ${credentials}`,
      },
    });
  }

  private async fetchNictiz(system: string, code: string): Promise<Response> {
    const params = `system=${encodeURIComponent(system)}&code=${encodeURIComponent(code)}&displayLanguage=nl`;
    const url = `${this.baseUrl}/fhir/CodeSystem/$lookup?${params}`;

    let token = await this.getAccessToken();
    let response = await fetch(url, {
      headers: {
        Accept: 'application/fhir+json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      this.accessToken = null;
      token = await this.getAccessToken();
      response = await fetch(url, {
        headers: {
          Accept: 'application/fhir+json',
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return response;
  }
}
