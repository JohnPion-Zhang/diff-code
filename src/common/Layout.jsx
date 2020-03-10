import React, { useReducer, useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  splitTextToLines
} from '../util'
import Sidebar from '../sidebar/index.jsx'
import Topbar from '../topbar/index.jsx'
import Workbench from '../workbench/index.jsx'
import './Layout.css'

const TREE_HANDLER = {
  set_active_tree_uuid: (state, { payload }) => ({
    ...state,
    activeTreeUuid: payload
  }),
  push_bundles: (state, { payload }) => {
    if (state.treeData.find(item => payload.title === item.title)) return state
    const _temp = { ...state, treeData: state.treeData.concat(payload) }
    return _temp
  },
} 


const treeReducer = (state, action) => {
  const handler = TREE_HANDLER[action.type]
  return handler? handler(state, action): state
}

const treeInitialState = {
  activeTreeUuid: 'default', 
  treeData: [{ 
    title: 'Chicken', 
    subtitle: uuidv4(),
    expanded: true, 
    children: [{ 
      title: 'Egg',
      subtitle: uuidv4(),
      bundleIndicator: 0,
    }] 
  },
  { 
    title: 'Fish', 
    subtitle: uuidv4(),
    expanded: true, 
    children: [{ 
      title: 'fingerline',
      subtitle: uuidv4(),
      bundleIndicator: 1,
    }] 
  }], // end treeData
}

const CODE_BUNDLE_HANDLER = {
  add_bundle: (state, { payload }) => ({
    ...state,
    bundleData: state.bundleData.concat(payload),
  }),
  update_code_by_direction: (state, { 
    payload: {
      index,
      direction,
      code,
    } 
  }) => {
    const _tmpBundleData = state.bundleData
    _tmpBundleData[index][direction] = code
    return { ...state, bundleData: _tmpBundleData }
  },
}

const codeBundleInitialState = {
  bundleData: [{
    leftCode: `
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) {
  console.log('bar')
}

console.log('done')
`,
    rightCode: `const a = 10
const boo = 10

if(a === 10) {
  console.log('bar')
}
`
  }, {
    leftCode: '_____left',
    rightCode: '_____right'
  }]
}

const codeBundleReducer = (state, action) => {
  const handler = CODE_BUNDLE_HANDLER[action.type]
  return handler? handler(state, action): state
}

const WORKBENCH_HANDLER = {
  set_input_line: (state, { payload }) => ({
    ...state,
    inputLine: payload
  }),
  set_input_content: (state, { payload }) => ({
    ...state,
    inputContent: payload
  }),
}

const workbenchInitialState = {
  diffViewerUpadteTimes: 0,
  inputLine: -1,
  inputContent: ''
}

const workbenchReducer = (state, action) => {
  const handler = WORKBENCH_HANDLER[action.type]
  return handler? handler(state, action): state
}

const _findRevelantBundleIndicatorByTreeUuid = (treeData, treeUuid) => {
  const _children = treeData.flatMap(item => item.children || { }) 
  const _target = _children.find(item => item.subtitle===treeUuid)
  return _target && _target['bundleIndicator']
}

const Layout = () => {
  const [ treeState, treeDispatch ] = useReducer(treeReducer, treeInitialState)
  const [ codeBundleState, codeBundleDispatch ] = useReducer(codeBundleReducer, codeBundleInitialState)
  const [ workbenchState, workbenchDispatch ] = useReducer(workbenchReducer, workbenchInitialState)

  const _treeDispatch = useCallback(treeDispatch, [ ])

  const _handleSelectSidebarItem = uuid => e => {
    e.stopPropagation()
    e.preventDefault()
    treeDispatch({
      type: 'set_active_tree_uuid',
      payload: uuid
    })
    workbenchDispatch({
      type: 'set_input_content',
      payload: ''
    })
  }

  const _workbenchDispatch = useCallback(workbenchDispatch, [ ])

  const _activeBundleIndex = useMemo(() => _findRevelantBundleIndicatorByTreeUuid(treeState.treeData, treeState.activeTreeUuid), [ treeState ])

  const _acitveBundle = useMemo(() => codeBundleState.bundleData[_activeBundleIndex], [ _activeBundleIndex, codeBundleState ])

  const _handleSubmitInputContent = useCallback(direction => event => {
    // 替换对应行号代码并重新串连起来
    let {
      inputLine,
      inputContent
    } = workbenchState
    let _targetCodeArr = splitTextToLines('leftCode'===direction? _acitveBundle.leftCode: _acitveBundle.rightCode)
    _targetCodeArr[inputLine] = inputContent
    let _targetCode = _targetCodeArr.join('\n')

    codeBundleDispatch({
      type: 'update_code_by_direction',
      payload: {
        index: _activeBundleIndex, 
        direction,
        code: _targetCode,
      }
    })

    return 
  }, [ workbenchState, _acitveBundle, _activeBundleIndex, codeBundleDispatch ])

  return (
    <article className="layout-container">
      <Topbar />
      <div className="my-wrapper">
        <Sidebar { ...treeState  } handleSelectSidebarItem={ _handleSelectSidebarItem } />
        <Workbench
          { ...workbenchState } 
          { ..._acitveBundle }
          activeBundleIndex={ _activeBundleIndex }
          workbenchDispatch={ _workbenchDispatch } 
          handleSubmitInputContent={ _handleSubmitInputContent }
        />
      </div>
    </article>
  )
}

export default Layout