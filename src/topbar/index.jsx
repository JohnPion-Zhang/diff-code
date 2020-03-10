import React from 'react'
import './index.css'

const Topbar = () => {
  const {
    title,
    avatar
  } = {
    title: 'A Big Title',
    avatar: require('../logo.svg')
  }
  return (
    <header className="topbar-container">
      <h2 className="topbar-container__title">{ title }</h2>
      <img src={ avatar } alt="avatar" className="topbar-container__avatar"/>
    </header>
  )
}

export default Topbar