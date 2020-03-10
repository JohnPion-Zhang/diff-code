import React from 'react'
import 'react-sortable-tree/style.css';
import SortableTree from 'react-sortable-tree'
import CustomNode from './CustomNode.jsx'
import './index.css'

const Sidebar =  ({ treeData, activeTreeUuid, handleSelectSidebarItem }) => {

  const generateNodeProps = callbackParams => {
    const {
      lowerSiblingCounts,
      ...rest
    } = callbackParams


    return ({
      ...rest,
      activeTreeUuid, 
      handleSelectSidebarItem
    })
  }

  const handleChange = (e) => {
  }

  return (
    <aside className="sidebar-container">
      <SortableTree 
        treeData= { treeData } 
        activeTreeUuid= { activeTreeUuid }
        generateNodeProps={ generateNodeProps }
        onChange={ handleChange } 
        handleSelectSidebarItem={ handleSelectSidebarItem }
        nodeContentRenderer={ CustomNode }
      />
    </aside>
  )
}

export default Sidebar