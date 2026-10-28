import { Calculator, X } from "lucide-react";
import { useState } from "react";

import { quickTools } from "../../data/dashboardData";

function QuickTools({ styles }) {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const [firstNumber, setFirstNumber] = useState("");

  const [secondNumber, setSecondNumber] = useState("");

  const [result, setResult] = useState(null);

  const handleToolClick = (toolId) => {
    if (toolId === "calculator") {
      setCalculatorOpen(true);
    }
  };

  const calculate = (operator) => {
    const first = Number(firstNumber);
    const second = Number(secondNumber);

    if (
      firstNumber.trim() === "" ||
      secondNumber.trim() === "" ||
      !Number.isFinite(first) ||
      !Number.isFinite(second)
    ) {
      setResult("Enter valid numbers");
      return;
    }

    if (operator === "+") {
      setResult(first + second);
    }

    if (operator === "-") {
      setResult(first - second);
    }

    if (operator === "×") {
      setResult(first * second);
    }

    if (operator === "÷") {
      setResult(second === 0 ? "Cannot divide by zero" : first / second);
    }
  };

  return (
    <section className={`${styles.panel} ${styles.quickTools}`}>
      <header className={styles.panelHeader}>
        <div>
          <span className={styles.lightning}>⚡</span>

          <h2>Quick Tools</h2>
        </div>
      </header>

      <div className={styles.toolsGrid}>
        {quickTools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.id}
              type="button"
              className={styles.toolCard}
              onClick={() => handleToolClick(tool.id)}
            >
              <span
                className={`${styles.toolIcon} ${styles[`tool${tool.color}`]}`}
              >
                <Icon size={25} />
              </span>

              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {calculatorOpen && (
        <div className={styles.toolDialog}>
          <div className={styles.dialogHeader}>
            <div>
              <Calculator size={19} />
              <h3>Calculator</h3>
            </div>

            <button
              type="button"
              onClick={() => setCalculatorOpen(false)}
              aria-label="Close calculator"
            >
              <X size={18} />
            </button>
          </div>

          <div className={styles.calculatorInputs}>
            <input
              type="number"
              value={firstNumber}
              onChange={(event) => setFirstNumber(event.target.value)}
              placeholder="First number"
            />

            <input
              type="number"
              value={secondNumber}
              onChange={(event) => setSecondNumber(event.target.value)}
              placeholder="Second number"
            />
          </div>

          <div className={styles.calculatorActions}>
            {["+", "-", "×", "÷"].map((operator) => (
              <button
                key={operator}
                type="button"
                onClick={() => calculate(operator)}
              >
                {operator}
              </button>
            ))}
          </div>

          <output className={styles.calculatorResult} aria-live="polite">
            {result === null ? "Result" : result}
          </output>
        </div>
      )}
    </section>
  );
}

export default QuickTools;
