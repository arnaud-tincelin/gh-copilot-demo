import { describe, expect, it } from "vitest";
import { validateDate, validateIPV6 } from "./validators";

// test the validateDate function
describe("validateDate", () => {
    it("should return a Date object for valid date input", () => {
        const input = "25/12/2020";
        const result = validateDate(input);
        expect(result).toBeInstanceOf(Date);
        expect(result?.getFullYear()).toBe(2020);
        expect(result?.getMonth()).toBe(11); // December is month 11 (0-based)
        expect(result?.getDate()).toBe(25);
    });

    it("should return null for invalid date input", () => {
        const input = "31/02/2020"; // Invalid date
        const result = validateDate(input);
        expect(result).toBeNull();
    });

    it("should return null for non-date input", () => {
        const input = "not a date";
        const result = validateDate(input);
        expect(result).toBeNull();
    });
}
