import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import format from "date-fns/format";

class DeleteTable extends Component {
  state = {
    deleted_forms: []
  };
  static getDerivedStateFromProps(props, state) {
    return {
      deleted_forms: props.deleted_forms,
      table: props.table
    };
  }
  render() {
    return (
      <React.Fragment>
        <Table responsive="xl" className="table  table-bordered  dataTable ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Last Response On</th>
              <th>Created Date</th>
              <th>Submissions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.deleted_forms.map((deleted, key) => {
              return (
                <tr key={key}>
                  <td>{deleted.name}</td>
                  <td>{deleted.title}</td>
                  <td>
                    {" "}
                    {deleted.last_response.length > 0
                      ? format(deleted.last_response, [
                          "MMMM Do YYYY, h:mm:ss a"
                        ])
                      : ""}
                  </td>
                  <td>{deleted.created_date}</td>
                  <td>
                    {this.state.table == "site" ? (
                      deleted.fsxf_id ? (
                        <Link
                          className="view-tag tag"
                          to={`/site-submission-data/${this.props.id}/${deleted.fsxf_id}`}
                        >
                          {deleted.response_count}
                        </Link>
                      ) : (
                        <Link
                          className="view-tag tag"
                          to={`/site-submission-data/${this.props.id}/${deleted.id}`}
                        >
                          {deleted.response_count}
                        </Link>
                      )
                    ) : deleted.fsxf_id ? (
                      <Link
                        className="view-tag tag"
                        to={`/submission-data/${this.props.id}/${deleted.fsxf_id}`}
                      >
                        {deleted.response_count}
                      </Link>
                    ) : (
                      <Link
                        className="view-tag tag"
                        to={`/submission-data/${this.props.id}/${deleted.id}`}
                      >
                        {deleted.response_count}
                      </Link>
                    )}
                  </td>
                  <td>
                    {this.state.table == "site" ? (
                      deleted.fsxf_id ? (
                        <Link
                          className="view-tag tag"
                          to={`/site-submission-data/${this.props.id}/${deleted.fsxf_id}`}
                        >
                          <i className="la la-eye view-tag tag"></i>
                        </Link>
                      ) : (
                        <Link
                          className="view-tag tag"
                          to={`/site-submission-data/${this.props.id}/${deleted.id}`}
                        >
                          <i className="la la-eye view-tag tag"></i>
                        </Link>
                      )
                    ) : deleted.fsxf_id ? (
                      <Link
                        className="view-tag tag"
                        to={`/submission-data/${this.props.id}/${deleted.fsxf_id}`}
                      >
                        <i className="la la-eye view-tag tag"></i>
                      </Link>
                    ) : (
                      <Link
                        className="view-tag tag"
                        to={`/submission-data/${this.props.id}/${deleted.id}`}
                      >
                        <i className="la la-eye view-tag tag"></i>
                      </Link>
                    )}
                    {deleted.download_url === null ? (
                      <a className="edit-tag tag disable pointer">
                        <i className="la la-download"></i>
                      </a>
                    ) : (
                      <a href={deleted.download_url} className="edit-tag tag">
                        <i className="la la-download"></i>{" "}
                      </a>
                    )}
                    {this.state.table == "site" ? (
                      deleted.fsxf_id ? (
                        <Link
                          className="pending-tag tag"
                          to={`/site-version-submission/${this.props.id}/${deleted.fsxf_id}`}
                        >
                          <i className="la la-clone edit-tag tag"></i>
                        </Link>
                      ) : (
                        <Link
                          className="pending-tag tag"
                          to={`/site-version-submission/${this.props.id}/${deleted.id}`}
                        >
                          <i className="la la-clone edit-tag tag"></i>
                        </Link>
                      )
                    ) : deleted.fsxf_id ? (
                      <Link
                        className="pending-tag tag"
                        to={`/project-version-submission/${this.props.id}/${deleted.fsxf_id}`}
                      >
                        <i className="la la-clone edit-tag tag"></i>
                      </Link>
                    ) : (
                      <Link
                        className="pending-tag tag"
                        to={`/project-version-submission/${this.props.id}/${deleted.id}`}
                      >
                        <i className="la la-clone edit-tag tag"></i>
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}
export default DeleteTable;