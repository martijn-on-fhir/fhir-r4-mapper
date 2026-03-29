import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

/**
 * Guard that validates OAuth 2.0 Bearer tokens using the Keycloak JWKS endpoint.
 *
 * Extracts the JWT from the `Authorization: Bearer <token>` header, fetches the
 * signing key from the provider's JWKS URI, and verifies the token's signature,
 * issuer, and audience. Throws `401 Unauthorized` on missing or invalid tokens.
 *
 * Configuration (via ConfigService):
 * - `oauth.issuer` – OpenID Connect issuer URL (e.g. Keycloak realm URL)
 * - `oauth.audience` – expected `aud` claim
 */
@Injectable()
export class OAuthGuard implements CanActivate {
  private jwksClient: jwksRsa.JwksClient;

  constructor(private readonly config: ConfigService) {
    this.jwksClient = jwksRsa({
      jwksUri: `${this.config.getOrThrow<string>('oauth.issuer')}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  /**
   * Validates the Bearer token from the incoming request.
   * @param context - The current execution context.
   * @returns `true` if the token is valid.
   * @throws {UnauthorizedException} If the token is missing, malformed, or fails verification.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Missing Bearer token');

    try {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded) throw new Error('Invalid token');

      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      jwt.verify(token, key.getPublicKey(), {
        issuer: this.config.getOrThrow<string>('oauth.issuer'),
        audience: this.config.get<string>('oauth.audience'),
        algorithms: ['RS256'],
      });

      return true;

    } catch (error) {
      throw new UnauthorizedException(error instanceof Error ? error.message : 'Invalid token');
    }
  }

  /**
   * Extracts the Bearer token from the `Authorization` header.
   * @param request - The incoming HTTP request.
   * @returns The raw JWT string, or `undefined` if no Bearer token is present.
   */
  private extractToken(request: Request): string | undefined {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return undefined;

    return auth.slice(7);
  }
}
