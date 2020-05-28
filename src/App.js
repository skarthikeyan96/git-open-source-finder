import React from 'react'
import Pagination from './pagination'
import Collections from './collections'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
const fetch = require('isomorphic-fetch')

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      issues: [],
      languageSearchTerm: false,
      languageSearch: '',
      defaultSelect: 'beginner',
      selectChange: false,
      loading: false,
      totalCount: 0,
      initialPage: 1,
      nextPage: false,
      prevPage: false
    }
  }

  componentDidMount () {
    fetch(
      `https://api.github.com/search/issues?q=language:${this.state.languageSearch.toLowerCase()}+label:${
        this.state.defaultSelect
      }+state:open&sort=created&order=desc&page=${this.state.initialPage}`
    )
      .then((d) => d.json())
      .then((r) => {
        this.setState({
          issues: r.items,
          totalCount: r.total_count
        })
        console.log(r)
      })
  }

  componentDidUpdate (prevprops, prevstate) {
    if (
      prevstate.defaultSelect !== this.state.defaultSelect ||
      prevstate.languageSearchTerm !== this.state.languageSearchTerm
    ) {
      this.setState(
        {
          selectChange: !this.state.selectChange
        },
        () => {}
      )
      fetch(
        `https://api.github.com/search/issues?q=language:${this.state.languageSearch.toLowerCase()}+label:${
          this.state.defaultSelect
        }+state:open&sort=created&order=desc`
      )
        .then((d) => d.json())
        .then((r) => {
          this.setState({
            issues: r.items,
            totalCount: r.total_count
          })
        })
    }
  }

  handleChange = (e) => {
    this.setState({
      selectChange: !this.state.selectChange,
      defaultSelect: e.target.value
    })
  }

  handleLang = (e) => {
    this.setState({
      languageSearch: e.target.value
    })
  };

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      this.setState({
        languageSearchTerm: !this.state.languageSearchTerm
      })
    }
  };

  onhandleNextPage = (e) => {
    const perPageCount = 30
    const totalCount = this.state.totalCount ? this.state.totalCount : 0
    const noOfPages = Math.ceil(totalCount / perPageCount)

    if (this.state.initialPage <= noOfPages) {
      this.setState(
        {
          initialPage: this.state.initialPage + 1
        },
        () => {
          fetch(
            `https://api.github.com/search/issues?q=language:${this.state.languageSearch.toLowerCase()}+label:${
              this.state.defaultSelect
            }+state:open&sort=created&order=desc&page=${this.state.initialPage}`
          )
            .then((d) => d.json())
            .then((r) => {
              this.setState({
                issues: r.items,
                nextPage: !this.state.nextPage
              })
            })
        }
      )
    }
  };

  onhandlePrevPage = (e) => {
    console.log(e.target)

    if (this.state.initialPage > 1) {
      console.log('inside the state')
      this.setState({
        initialPage: this.state.initialPage - 1
      })
    }
  };

   renderTags = (e) => {
     const language = this.state.languageSearch.toLowerCase()
     return (
       <div className='container-fluid'>
         {language.length > 0 ? (
           <button className='btn btn-primary'>
             {' '}
             {language}{' '}
             <span className='badge'> {this.state.totalCount} </span>{' '}
           </button>
         ) : (
           <> </>
         )}

         <button className='btn btn-dark issue-label'>
           {' '}
           {this.state.defaultSelect}{' '}
           <span className='badge badge-danger'>
             {' '}
             {this.state.totalCount}{' '}
           </span>{' '}
         </button>
       </div>
     )
   };

    count = () => {
      const perPageCount = 30

      if (this.state.nextPage) {
        return (
          <p>
            {' '}
            Showing {perPageCount + perPageCount} of {this.state.totalCount}{' '}
            results{' '}
          </p>
        )
      }
      return (
        <p>
          {' '}
          Showing {perPageCount} of {this.state.totalCount} results{' '}
        </p>
      )
    };

    render () {
      const labels = [
        'beginner',
        'easy',
        'starter',
        'good first bug',
        'low hanging fruit',
        'bitesize',
        'trivial',
        'easy fix',
        'new contributor'
      ]

      return (
        <div>
          <div className='container-fluid'>
            <nav className='navbar navbar-expand-lg fixed-top navbar-light bg-dark'>
              <a className='navbar-brand' href='#' style={{ color: 'white' }}>
                {'Open Source Finder'.toUpperCase()}
              </a>
            </nav>
          </div>

          <div className='container-fluid'>
            <div className='row'>
              <div className='col-md-6'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter programming language'
                  onChange={this.handleLang}
                  onKeyDown={this.handleEnter}
                />
              </div>
              <div className='col-md-6'>
                <select
                  value={this.state.selectValue}
                  onChange={this.handleChange}
                  className='form-control'
                >
                  {labels.map((label) => {
                    return <option key={label}> {label} </option>
                  })}
                </select>
              </div>
            </div>
          </div>

          <br />

          {this.renderTags()}

          <hr />

          <div className='container-fluid'>{this.count()}</div>

          <Collections
            issues={this.state.issues}
            selectionLabel={this.state.defaultSelect}
          />
          <Pagination
            totalCount={this.state.totalCount}
            handleNextPage={this.onhandleNextPage}
            handlePrevPage={this.onhandlePrevPage}
            initialPage={this.state.initialPage}
          />
        </div>
      )
    }
}

export default App
