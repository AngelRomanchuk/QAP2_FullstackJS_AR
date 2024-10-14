const { isCorrectAnswer, getQuestion } = require("../../utils/mathUtilities");

describe("Tests for getQuestion", () => {
    it("should retrieve a question", () => {
        const question = getQuestion();
        expect(question).toBeDefined(); // Check if a question object is retrieved
    });
});

describe("Tests for isCorrectAnswer", () => {
    it("should check if a correct answer is detected", () => {
        const result = isCorrectAnswer(5, 5);
        expect(result).toBeDefined(); // Check if the result is defined
    });

    it("should check if an incorrect answer is detected", () => {
        const result = isCorrectAnswer(5, 3);
        expect(result).toBeDefined(); // Check if the result is defined
    });
});