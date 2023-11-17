import React from "react"

export default function Loading() {
    return (
        <div className="loading-container">
            <h4 className="loading-text">Loading data...</h4>
            <img src="./img/loading.svg" className="loading-img"/>
        </div>
    )
}