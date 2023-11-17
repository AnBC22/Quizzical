import React from "react"
import StartPage from "./components/StartPage"
import Quiz from "./components/Quiz"
import ErrorPage from "./components/ErrorPage"
import Loading from "./components/Loading"
import { nanoid } from "nanoid"
import { decode } from 'html-entities'

export default function App() {
    const [quizData, setQuizData] = React.useState(null)
    const [startQuiz, setStartQuiz] = React.useState(false)
    const [questionElements, setQuestionElements] = React.useState([])
    const [wantsCheckAnswers, setWantsCheckAnswers] = React.useState(false)
    const [score, setScore] = React.useState(0)
    const [newGame, setNewGame] = React.useState(false)
    const [apiError, setApiError] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)
    
    React.useEffect(() => {
        fetchQuizData()
    }, [])
    
    function fetchQuizData() { 
        setIsLoading(true)
        fetch('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple')
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error(`API responded with status: ${res.status}`)
                }
            })
            .then(data =>
                data.results.map(questionObj => {
                    return Object.assign({}, questionObj, {
                        correct_answer: {
                            correct_answer_text: questionObj.correct_answer, 
                            id: nanoid(),
                            on: false
                        },
                        incorrect_answers: questionObj.incorrect_answers.map(inc_answ => {
                            return {
                                wrong_answer_text: inc_answ, 
                                id: nanoid(), 
                                on: false
                            }
                        })
                    })
                })
            )
            .then(data => setQuizData(data.map(questionObj => {
                setIsLoading(false)
                return {
                    question: questionObj.question,
                    questionId: nanoid(), 
                    answers: getCombinedAnswersArray(questionObj.incorrect_answers, questionObj.correct_answer)
                }
            })))
            .catch(err => {
                console.error('Fetch error:', err)
                setApiError(true)
            })
    }
    
    function getCombinedAnswersArray(targetArray, objToInsert) {
        const randomPosition = Math.floor(Math.random() * (targetArray.length + 1))
        const combinedAnswersArray = [...targetArray.slice(0, randomPosition), objToInsert, ...targetArray.slice(randomPosition)]
        return combinedAnswersArray
    }  

    function handleStartQuiz() {
        setStartQuiz(true)
    }
    
    React.useEffect(() => {
        if (startQuiz && !isLoading) {
            setQuestionElements(quizData.map(questionObj => {
                return (
                    <div key={nanoid()} className="question-container">
                        <h4 className="questions">{decode(questionObj.question)}</h4>
                        <div className="answers">
                            {questionObj.answers.map(answer => {
                                const styles = getStyles(answer.correct_answer_text, answer.on, questionObj.questionId)
                                return (
                                    <button 
                                        key={nanoid()}
                                        className="answer-btn"
                                        style={styles}
                                        onClick={() => toggle(answer.id, questionObj.questionId)}
                                        disabled={wantsCheckAnswers}
                                    >
                                        {decode(answer.correct_answer_text || answer.wrong_answer_text)}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
            }))  
        }
    }, [startQuiz, quizData, wantsCheckAnswers])
    
    function getStyles(isRightAnswer, selectedAnswer, questionId) {
        const styles = {}
        if (wantsCheckAnswers) {
            styles.border = "0.8px solid #808080"
            styles.color = "#808080" 
            if (isRightAnswer && !selectedAnswer) {
                styles.backgroundColor = "#F8BCBC" 
            } else if (selectedAnswer) {
                styles.backgroundColor = "#94D7A2"
                styles.color = "#293264"
            } else {
                styles.color = "#808080"
            }
            getScore(styles, questionId)
        } else {
            styles.backgroundColor = selectedAnswer ? "#d6dbf5" : "white"
        }
        return styles
    }
    
    function getScore(finalStyles, id) {
        if (finalStyles.backgroundColor) {
            if (finalStyles.backgroundColor === "#F8BCBC") {
                setScore(prevVal => prevVal - 1)
            } else if (finalStyles.backgroundColor === "#94D7A2") {
                setScore(prevVal => prevVal + 1)
            }
        } 
    }
    
    function toggle(id, questionId) {
       setQuizData(prevData => {
           return prevData.map(questionObj => {
               if (questionObj.questionId === questionId) {
                   return Object.assign({}, questionObj, {
                       answers: questionObj.answers.map(answer => {
                           if (answer.id === id) {
                               return Object.assign({}, answer, { on: !answer.on })
                           } else {
                               return Object.assign({}, answer, { on: false })
                           }
                       })
                   })
               } else {
                   return questionObj
               }
           })
       }) 
    }
    
    function showAnswers() {
        let numAnswers = 0
        quizData.forEach(questionObj => {
            questionObj.answers.forEach(answer => {
                if (answer.on) {
                    numAnswers++
                }
            })
        })
        if (numAnswers === 5) {
            setWantsCheckAnswers(true)
        } else {
            alert("Please answer all questions")
        }
    }
    
    function startNewGame() {
        setWantsCheckAnswers(false)
        setScore(0)
        setQuestionElements([])
        fetchQuizData()
    }
    
    return (
        <main>
            {apiError ? 
                <ErrorPage /> :
            isLoading && startQuiz ? 
                <Loading /> :
            startQuiz ? 
                <Quiz
                    questionElements={questionElements}
                    showAnswers={showAnswers}
                    wantsCheckAnswers={wantsCheckAnswers}
                    handleStartQuiz={handleStartQuiz}
                    score={score}
                    startNewGame={startNewGame}
                /> : 
                <StartPage 
                    handleStartQuiz={handleStartQuiz}
                    isLoading={isLoading}
                />
            }
        </main>
    )
}
