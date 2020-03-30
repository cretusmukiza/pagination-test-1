import React from 'react'
import errorImage from './error.svg'
const ErrorPage = () => {
    return (
        <div className="container error d-flex justify-content-center align-items-center  ">
            <img src={errorImage} width="100" height="100" alt="error image" />
        </div>
    )
}
export default ErrorPage