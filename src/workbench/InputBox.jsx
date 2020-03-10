import React, { Fragment } from 'react'
import './InputBox.css'

const InputBox = ({
  inputContent,
  handleInputContentChange,
  handleSubmit
}) => {


  return (
    <Fragment>
      <textarea 
        className="workbench-article__textarea" 
        value={ inputContent }
        onChange={ handleInputContentChange }
      />
      <button type="primary" className="workbench-article__submit color blue"
        onClick={ handleSubmit }
      >
        Submit
      </button>
    </Fragment>
  )
}

export default InputBox