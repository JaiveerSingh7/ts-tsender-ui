import { describe, expect, it } from "vitest"
import { calculateTotal } from "./calculateTotal"

describe('calculateTotal', ()=> {
    it('should work with newlines', () => {
        expect(calculateTotal('100\n200')).toBe(300);
        expect(calculateTotal('100\n200\n300')).toBe(600);
    });
    it('should handle mixed delimters', () => {
        expect(calculateTotal('100,200\n300')).toBe(600);
        expect(calculateTotal('1.5\n2.5,3.5')).toBe(7.5);
        expect(calculateTotal('200,,300\n\n400')).toBe(900);
    });
    it('should handle empty input', () => {
        expect(calculateTotal('')).toBe(0);
        expect(calculateTotal(',\n,  ')).toBe(0);
    });
    it('should ignore invalid numbers', () => {
        expect(calculateTotal('abc,123')).toBe(123);
        expect(calculateTotal('12three\n140  ')).toBe(152);
        expect(calculateTotal('123.45.67')).toBe(123.45);
    });


})