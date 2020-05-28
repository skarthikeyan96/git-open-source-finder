import React from 'react'

const BASE_URL = 'https://github.com'

const Collections = ({ issues, selectionLabel }) => {
  if (issues.length === 0) {
    return (
      <div className='container-fluid'>
        {' '}
        <p className='text-danger'>
          {' '}
            No issues found for the label for {selectionLabel}
        </p>{' '}
      </div>
    )
  }
  return (
    <div className='container-fluid table-container'>
      <table className='table table-striped table-bordered table-hover table-responsive'>
        <thead>
          <tr>
            <th> Issue no</th>
            <th> Issue Title</th>
            <th> Repository </th>
            <th> Issue state </th>
            <th> Updated Date </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, index) => {
            const repo = issue.repository_url.split('/')
            const ownerName = `${repo[repo.length - 2]}`
            const repoName = `${repo[repo.length - 1]}`

            const updatedDate = `${new Date(
                issue.updated_at
              ).getDate()}/${new Date(issue.updated_at).getMonth()}/${new Date(
                issue.updated_at
              ).getFullYear()}`
            return (
              <tr key={issue.id}>
                <th>
                  {' '}
                  <a
                    href={issue.html_url}
                    target='_blank'
                    rel='noreferrer noopener'
                    className='issueNumber'
                  >
                    {' '}
                      #{issue.number}{' '}
                  </a>{' '}
                </th>
                <td> {issue.title} </td>
                <td>
                  {' '}
                  <a
                    href={`${BASE_URL}/${ownerName}/${repoName}`}
                    target='_blank'
                    rel='noreferrer noopener'
                  >{`${ownerName}/${repoName}`}
                  </a>{' '}
                </td>
                <td> {issue.state} </td>
                <td> {updatedDate} </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Collections
