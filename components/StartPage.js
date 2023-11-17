import React from "react"
import Loading from "./Loading"

export default function StartPage(props) {
    return (
        <section className="center-page">
            <h1>Quizzical 📚</h1>
            <p className="description">Test your knowledge and achieve the highest score!</p>
            <button className="btn start-btn" onClick={props.handleStartQuiz}>Start quiz</button>
            {
                props.isLoading && 
                <Loading />
            }
        </section>
    )
}