import { describe, expect, test } from "bun:test";
import { embeddingModel } from "@/lib/embedding_service";

describe("Atlas knowledge bridge config",()=>{
  test("modelo padrão coincide com a VPS do escritório",()=>{
    const old=process.env.OLLAMA_EMBEDDING_MODEL;
    delete process.env.OLLAMA_EMBEDDING_MODEL;
    expect(embeddingModel()).toBe("nomic-embed-text");
    if(old)process.env.OLLAMA_EMBEDDING_MODEL=old;
  });
});
