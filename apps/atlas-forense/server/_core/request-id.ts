/**
 * Correlação ponta a ponta (plano de profissionalização, tarefa F1.3).
 *
 * Todo request recebe `X-Request-Id`: o id do chamador (ex.: JuridIA) é reusado
 * quando válido; caso contrário, um novo `req_<24 hex>` é gerado. O id fica
 * disponível aos handlers em `req.requestId` e é ecoado na resposta, permitindo
 * rastrear uma chamada de ponta a ponta em logs dos dois serviços e do proxy.
 */
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { normalizeRequestId } from "@shared/brain-api";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export const attachRequestId: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const requestId = normalizeRequestId(req.headers["x-request-id"]);
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};
