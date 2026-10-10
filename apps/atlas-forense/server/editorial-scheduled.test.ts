import { describe, expect, it } from "vitest";
import { authenticateEditorialScheduleSecret } from "./editorial-scheduled";

describe("VPS editorial scheduler auth", () => {
  const strong = "T".repeat(48);
  it("fails closed without a strong configured secret", () => {
    expect(authenticateEditorialScheduleSecret(strong, undefined)).toBe(false);
    expect(authenticateEditorialScheduleSecret(strong, "short")).toBe(false);
    expect(authenticateEditorialScheduleSecret(undefined, strong)).toBe(false);
    expect(authenticateEditorialScheduleSecret("short", strong)).toBe(false);
  });
  it("uses exact token equality without accepting near matches", () => {
    expect(authenticateEditorialScheduleSecret(strong, strong)).toBe(true);
    expect(authenticateEditorialScheduleSecret("X" + strong.slice(1), strong)).toBe(false);
  });
});
