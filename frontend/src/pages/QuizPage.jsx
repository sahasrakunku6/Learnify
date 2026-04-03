import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Chatbot from "../components/Chatbot";
import { API_BASE } from "../config.js";

const QuizPage = () => {
    const [topic, setTopic] = useState("");              // what user types
    const [appliedTopic, setAppliedTopic] = useState(""); // topic applied after generate
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Selected difficulty (before generating quiz)
    const [difficulty, setDifficulty] = useState("medium");
    // Applied difficulty (after clicking generate quiz)
    const [appliedDifficulty, setAppliedDifficulty] = useState("medium");


    const fetchQuiz = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${API_BASE}/generate-quiz`, {
                topic,
                difficulty, // use selected difficulty
            });

            if (response.data.questions && response.data.questions.length > 0) {
                setQuestions(response.data.questions);
                setAppliedDifficulty(difficulty);
                setAppliedTopic(topic);

            } else {
                setError("No questions generated. Please try a different topic.");
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
            setError(error.response?.data?.error || "Failed to fetch quiz. Please try again.");
        }
        setLoading(false);
    };

    // Styling for difficulty buttons
    const getButtonClass = (level) => {
        return difficulty === level
            ? "px-4 py-2 bg-black text-white rounded-md mx-1"
            : "px-4 py-2 bg-gray-300 text-black rounded-md mx-1 hover:bg-gray-400";
    };

    const handleAnswerClick = (qIndex, option) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [qIndex]: option,
        }));
    };


    return (
        <div className="flex">
            <Sidebar />
            <div className="p-8 w-3/4 mx-auto">
                <h1 className="text-4xl font-bold text-black mb-6 text-center">AI-Generated Quiz</h1>

                <div className="p-8 w-full">
                    {/* Difficulty Selection */}
                    <div className="flex justify-center mb-4">
                        <button onClick={() => setDifficulty("easy")} className={getButtonClass("easy")}>
                            Easy
                        </button>
                        <button onClick={() => setDifficulty("medium")} className={getButtonClass("medium")}>
                            Medium
                        </button>
                        <button onClick={() => setDifficulty("hard")} className={getButtonClass("hard")}>
                            Hard
                        </button>
                    </div>

                    {/* Topic Input */}
                    <input
                        type="text"
                        placeholder="Enter a topic (e.g., Physics, History)"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="p-3 border border-gray-300 rounded w-full mb-2"
                        onKeyPress={(e) => e.key === "Enter" && fetchQuiz()}
                    />

                    {/* Generate Button */}
                    <button
                        onClick={fetchQuiz}
                        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 w-full"
                        disabled={loading}
                    >
                        {loading ? "Generating Quiz..." : "Generate Quiz"}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 mb-4 p-3 bg-red-50 rounded w-full max-w-md">
                        {error}
                    </div>
                )}

                {/* Quiz Display */}
                {questions.length > 0 && (
                    <div className="p-8 w-3/4 mx-auto">
                        <h2 className="text-2xl font-semibold mb-4 capitalize">
                            Quiz Questions on {appliedTopic} ({appliedDifficulty})
                        </h2>
                        <ul className="space-y-4">
                            {questions.map((q, index) => (
                                <li key={index} className="p-4 bg-gray-50 rounded border">
                                    <p className="font-semibold">Q{index + 1}: {q.question}</p>
                                    <div className="mt-2 space-y-2">
                                        {q.options.map((option, i) => {
                                            const isSelected = selectedAnswers[index] === option;
                                            const isCorrect = option === q.answer;
                                            let btnClass = "px-4 py-2 rounded w-full text-left border";

                                            if (isSelected) {
                                                btnClass += isCorrect
                                                    ? " bg-green-200 border-green-500"
                                                    : " bg-red-200 border-red-500";
                                            } else {
                                                btnClass += " hover:bg-gray-200";
                                            }

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleAnswerClick(index, option)}
                                                    className={btnClass}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


                <Chatbot />
            </div>
        </div>
    );
};

export default QuizPage;
