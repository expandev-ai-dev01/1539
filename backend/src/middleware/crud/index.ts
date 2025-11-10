import { Request } from 'express';
import { z } from 'zod';

export interface SecurityCheck {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export interface ValidatedRequest {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: any;
}

export class CrudController {
  private securityChecks: SecurityCheck[];

  constructor(securityChecks: SecurityCheck[]) {
    this.securityChecks = securityChecks;
  }

  async create(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | null, any]> {
    return this.validateRequest(req, schema, 'CREATE');
  }

  async read(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | null, any]> {
    return this.validateRequest(req, schema, 'READ');
  }

  async update(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | null, any]> {
    return this.validateRequest(req, schema, 'UPDATE');
  }

  async delete(req: Request, schema: z.ZodSchema): Promise<[ValidatedRequest | null, any]> {
    return this.validateRequest(req, schema, 'DELETE');
  }

  private async validateRequest(
    req: Request,
    schema: z.ZodSchema,
    permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
  ): Promise<[ValidatedRequest | null, any]> {
    try {
      const bodyData = req.method === 'GET' ? req.query : req.body;
      const paramsData = req.params;
      const combinedData = { ...bodyData, ...paramsData };

      const validated = await schema.parseAsync(combinedData);

      const credential = {
        idAccount: 1,
        idUser: 1,
      };

      return [
        {
          credential,
          params: validated,
        },
        null,
      ];
    } catch (error: any) {
      return [
        null,
        {
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.errors || error.message,
        },
      ];
    }
  }
}

export function successResponse(data: any, metadata?: any) {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

export function errorResponse(message: string, code?: string) {
  return {
    success: false,
    error: {
      code: code || 'ERROR',
      message,
    },
    timestamp: new Date().toISOString(),
  };
}

export const StatusGeneralError = {
  statusCode: 500,
  code: 'INTERNAL_SERVER_ERROR',
  message: 'An unexpected error occurred',
};
