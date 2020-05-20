import React from 'react'
// import ReactMarkdown from 'react-markdown'

import 'bulma/css/bulma.min.css'
import './App.css'
const fetch = require('isomorphic-fetch')
const BASE_URL = 'https://github.com'
const Collections = ({issues})=>{
  function createMarkup(html) {
    return {__html: html};
  }

  if(issues.length < 0){
    return('No issues found')
  }
  return(
    <div class="section table-container">
      <table class="table">
        <thead>
          <th> Issue no</th>
          <th> Issue Title</th>
          <th> Repository </th>
          <th> Issue state </th>
          <th> Updated Date </th>
        </thead>
        <tbody>
          {
            issues.map((issue,index) => {
              const repo = issue.repository_url.split('/')
              const owner_name = `${repo[repo.length - 2]}`
              const repo_name = `${repo[repo.length - 1]}`


              const updated_Date = `${new Date(issue.updated_at).getDate()}/${new Date(issue.updated_at).getMonth()}/${new Date(issue.updated_at).getFullYear()}`
              const labels = issue.labels
              return(
                <tr>
                  <th> <p style={{fontWeight:'bold'}}> {index} </p> </th>
                  <td> {issue.title} </td>
                  <td> <a href={`${BASE_URL}/${owner_name}/${repo_name}`} target='_blank'>{`${owner_name}/${repo_name}`}</a> </td>
                  <td> {issue.state} </td>

                  <td> {updated_Date} </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      issues: [],
      languageSearchTerm: false,
      languageSearch: '',
      defaultSelect: 'beginner',
      selectChange: false,
      loading: false
    }
  }

  handleSelect = (e) =>{

    this.setState({
      selectChange : !this.state.selectChange,
      defaultSelect: e.target.value
    })
  }

   Setlanguage = (e) => {
    this.setState({
      languageSearch: e.target.value
    })
  }

   searchRepo = (e) => {
    const language = this.state.languageSearch.toLowerCase()

    if (e.key === 'Enter') {
      this.setState({
        languageSearchTerm: !this.state.languageSearchTerm
      })
      fetch(`https://api.github.com/search/issues?q=language:${language}+label:${this.state.defaultSelect}+state:open&sort=created&order=desc`)
          .then((d) => d.json())
          .then(r => {
            this.setState({
              issues: r.items
            })
            console.log(r)
        })
    }
  }

  render () {
    const language = this.state.languageSearch.toLowerCase()
    // https://api.github.com/search/issues?q=language:python+label:easy+state:open&sort=created&order=desc
    const renderTags = (e) => {
      if (this.state.languageSearchTerm) {
        
        return (
          <div className='container'>
           
            <button className='button language'> {language} </button>
           
            <button className='button issue-label'> {this.state.defaultSelect} </button>
          </div>
        )
      }
    }
    
    const labels = [
      'beginner', 'easy', 'starter', 'good first bug', 'low hanging fruit', 'bitesize', 'trivial', 'easy fix', 'new contributor'
    ]
    return (
      <div>
        <nav class='navbar' role='navigation' aria-label='main navigation'>
          <div class='navbar-brand'>
            <a class='navbar-item' href='#'>
              {'Open Source Finder'.toUpperCase()}
            </a>
          </div>
        </nav>
        <div className='section columns'>
          <div class='column is-half'>
            <input
              type='text' className='input' placeholder='Enter programming language'
              onChange={this.Setlanguage}
              onKeyDown={this.searchRepo}
            />
          </div>
          <div class='column is-half'>
            <div class='select'>
              <select
                value={this.state.selectValue}
                onChange={this.handleSelect}
              >
                {
                  labels.map(label => {
                    return (<option key={label}> {label} </option>)
                  })
                }
              </select>
            </div>
          </div>
        </div>

        {
          renderTags()
        }

        

        <hr />
  
        <Collections issues = {this.state.issues}/>
      </div>
    )
  }
}

export default App
