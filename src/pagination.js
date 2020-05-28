import React from 'react'

const Pagination = ({ initialPage, handleNextPage, handlePrevPage }) => {
  return (

    <div className='container-fluid text-center'>
      <ul className='pagination justify-content-center'>
        <li className='page-item'><a className='page-link' disabled={initialPage === 1 ? 'disabled' : ''} onClick={handlePrevPage}>Previous</a></li>
        <li className='page-item'><a className='page-link' onClick={handleNextPage}>Next</a></li>
      </ul>
    </div>

  )
}

export default Pagination
