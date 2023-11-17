import React from "react"
import Confetti from "react-confetti"

export default function Quiz(props) {
    return (
        <section className="quiz">
            {props.score === 5 && <Confetti />}
            {props.questionElements}
            {props.wantsCheckAnswers ?
            <div className="score">
                <h4>You scored {props.score}/5 correct answers</h4>
                <button
                    className="btn option-btn"
                    onClick={props.startNewGame}
                >
                    Play again
                </button> 
            </div> : 
            <button
                className="btn option-btn check-answers-btn"
                onClick={props.showAnswers}
            >
                check answers
            </button>
            }  
        </section>
    )
}

