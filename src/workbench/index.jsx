import React, { Fragment, useCallback, useState } from 'react'
import ReactDiffViewer from 'react-diff-viewer'
import {
  splitTextToLines
} from '../util'
import InputBox from './InputBox.jsx'
import './index.css'

const Workbench = ({
  activeBundleIndex,
  leftCode,
  rightCode,
  inputLine,
  inputContent,
  workbenchDispatch,
  handleSubmitInputContent
}) => {
  // console.log('workbench re-render', leftCode, rightCode, inputLine, inputContent)
  const _handleClickLineContent = useCallback(({
    direction,
    words
  }) => {
    debugger
    let _targetCodeArr = splitTextToLines('leftCode'===direction? leftCode: rightCode)
    let _targetCodeLine = _targetCodeArr.findIndex(item => item.trim()===words.trim())

    setDirection(direction)
    workbenchDispatch({
      type: 'set_input_line',
      payload: _targetCodeLine
    })
    workbenchDispatch({
      type: 'set_input_content',
      payload: _targetCodeArr[_targetCodeLine]
    })
  }, [ leftCode, rightCode, workbenchDispatch ])

  const _handleInputContentChange = useCallback(({
    target: {
      value
    }
  }) => 
  {
    return workbenchDispatch({
      type: 'set_input_content',
      payload: value
    })
  }, [ workbenchDispatch ])

  const [ _direction, setDirection ] = useState(null)
  
  return (
    <div className="workbench-article">
      { !leftCode && !rightCode 
          ? <h4>Plz select a item from sidebar firstly</h4>
          :<Fragment>
            <ReactDiffViewer
                oldValue={ leftCode }
                newValue={ rightCode }
                splitView={ true }
                onLineContentClick={ _handleClickLineContent }
            />
            <InputBox 
              inputContent={ inputContent }
              handleInputContentChange={ _handleInputContentChange }
              handleSubmit={ handleSubmitInputContent(_direction) }
            />
          </Fragment>
      }
    </div>
  )
}

export default Workbench