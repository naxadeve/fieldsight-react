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
      deleted_forms: props.deleted_forms
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
                  <td>
                    <a href={`#/`}>{deleted.name}</a>
                  </td>
                  <td>{deleted.title}</td>
                  <td>
                    {deleted.last_response.length > 0
                      ? format(deleted.last_response, [
                          "MMMM Do YYYY, h:mm:ss a"
                        ])
                      : ""}
                  </td>
                  <td>{deleted.created_date}</td>
                  <td>
                    {" "}
                    <Link
                      to={`/submission-data/${this.props.id}/${deleted.fsxf_id}`}
                    >
                      {deleted.response_count}
                    </Link>
                  </td>

                  <td>
                    {deleted.view_submission_url === null ? (
                      <>
                        <i className="la la-eye"></i> {deleted.response_count}{" "}
                      </>
                    ) : (
                      <Link
                        className="view-tag tag"
                        to={`/submission-data/${this.props.id}/${deleted.fsxf_id}`}
                      >
                        <i className="la la-eye"></i>{" "}
                      </Link>
                    )}
                    {deleted.download_url === null ? (
                      <>
                        <i className="la la-download"></i>{" "}
                      </>
                    ) : (
                      <a href={deleted.download_url} className="edit-tag tag">
                        <i className="la la-download"></i>{" "}
                      </a>
                    )}
                    {deleted.versions_url === null ? (
                      <>
                        {" "}
                        <i className="la la-clone"></i>
                      </>
                    ) : (
                      <a
                        href={deleted.versions_url}
                        className="pending-tag tag"
                      >
                        <i className="la la-clone"></i>{" "}
                      </a>
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
