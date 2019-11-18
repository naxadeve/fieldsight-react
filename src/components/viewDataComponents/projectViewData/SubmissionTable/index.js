import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import WithPagination from '../../../../hoc/WithPagination';
import Modal from '../../../common/Modal';
import { DotLoader } from '../../../myForm/Loader';

class SubmissionData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fid: props.match.params && props.match.params.fid,
      id: props.match.params && props.match.params.id,
      siteList: [],
      mastersiteList: [],
      showConfirmation: false,
      breadcrumbs: {},
      isSurvey: false,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id, fid },
      },
      paginationHandler,
    } = this.props;
    paginationHandler(1, null, {
      type: 'formSubmission',
      projectId: this.state.id,
      fsxf_id: fid,
      status: 'form-submission',
    });

    this.setState({
      fid,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteList != this.props.siteList) {
      this.setState({
        siteList: nextProps.siteList,
        mastersiteList: nextProps.siteList,
        breadcrumbs: nextProps.breadcrumbs,
        isSurvey: nextProps.is_survey,
      });
    }
  }

  handleChange = async e => {
    const {
      target: { value },
    } = e;
    const { siteList, mastersiteList } = this.state;

    if (value) {
      const search = await siteList.filter(result => {
        return (
          result.submitted_by
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          (result.site_name !== null
            ? result.site_name
                .toLowerCase()
                .includes(value.toLowerCase())
            : '') ||
          (result.site_identifier !== null
            ? result.site_identifier
                .toLowerCase()
                .includes(value.toLowerCase())
            : '')
        );
      });

      this.setState({
        siteList: search,
      });
    } else {
      this.setState({
        siteList: mastersiteList,
      });
    }
  };

  cancleModel = () => {
    this.setState({
      showConfirmation: false,
    });
  };

  handleDelete = id => {
    this.setState({
      showConfirmation: true,
      id: id,
    });
  };

  delete = id => {
    let list = this.state.siteList;

    axios
      .get(`/fv3/api/delete-submission/${id}/`)
      .then(res => {
        if (res.status == 204) {
          this.setState(state => {
            const result = list.filter(data => {
              if (id !== data.submission_id) {
                return data;
              }
            });
            list = result;

            return {
              id: '',
              showConfirmation: false,
              siteList: list,
            };
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const {
      state: {
        breadcrumbs,
        siteList,
        isSurvey,
        id,
        fid,
        showConfirmation,
      },
      props: {
        dLoader,
        form_id_string,
        fromData,
        toData,
        totalCount,
        pageNum,
        paginationHandler,
        renderPageNumbers,
      },
    } = this;
    return (
      <React.Fragment>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href={breadcrumbs.project_url}>
                {breadcrumbs.project_name}
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href={breadcrumbs.responses_url}>
                {breadcrumbs.responses}
              </a>
            </li>
            <li className="breadcrumb-item">
              {breadcrumbs.current_page}
            </li>
          </ol>
        </nav>
        <div className="card">
          <div className="card-header main-card-header sub-card-header">
            <h5>Project Submissions</h5>
            <div className="dash-btn">
              <form className="floating-form">
                <div className="form-group mr-0">
                  <input
                    type="search"
                    className="form-control"
                    onChange={e => this.handleChange(e)}
                    required
                  />
                  <label htmlFor="input">Search</label>
                  <i className="la la-search"></i>
                </div>
              </form>
            </div>
          </div>
          {dLoader == false ? (
            <div className="card-body">
              <Table
                responsive="xl"
                className="table  table-bordered  dataTable "
              >
                <thead>
                  <tr>
                    {/* <th>S.N.</th>*/}
                    {!isSurvey && <th>Site Name</th>}
                    {!isSurvey && <th>Site Id</th>}
                    <th>submission id</th>
                    <th>Submitted By</th>
                    <th>Submission Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {siteList.length > 0 &&
                    siteList.map((list, key) => {
                      return (
                        <tr key={key}>
                          {/*<td>{key + this.props.fromData}</td>*/}
                          {!isSurvey && <td>{list.site_name}</td>}
                          {!isSurvey && (
                            <td>{list.site_identifier}</td>
                          )}
                          <td>{list.submission_id}</td>
                          <td>
                            <a href={list.profile_url}>
                              {list.submitted_by}
                            </a>
                          </td>
                          <td>{list.date}</td>

                          <td>
                            <a
                              className="view-tag tag"
                              href={`/fieldsight/application/?submission=${list.submission_id}#/submission-details`}
                            >
                              <i className="la la-eye"></i>
                            </a>
                            <a
                              className="edit-tag tag"
                              href={`/forms/edit/${form_id_string}/${list.submission_id}`}
                            >
                              <i className="la la-edit"></i>
                            </a>

                            <a
                              className="delete-tag tag"
                              onClick={() => {
                                this.handleDelete(list.submission_id);
                              }}
                            >
                              <i className="la la-trash-o"> </i>{' '}
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              {props.siteList && props.siteList.length > 0 ? (
                <div className="card-body">
                  <div className="table-footer">
                    <div className="showing-rows">
                      <p>
                        Showing <span>{fromData}</span> to{' '}
                        <span>
                          {' '}
                          {toData > totalCount
                            ? totalCount
                            : toData}{' '}
                        </span>{' '}
                        of <span>{totalCount}</span> entries.
                      </p>
                    </div>

                    {toData < totalCount ? (
                      <div className="table-pagination">
                        <ul>
                          <li className="page-item">
                            <a
                              onClick={e =>
                                paginationHandler(pageNum - 1, null, {
                                  type: 'formSubmission',
                                  projectId: id,
                                  fsxf_id: fid,
                                  status: 'form-submission',
                                })
                              }
                            >
                              <i
                                className={`la la-long-arrow-left ${this
                                  .props.fromData ==
                                  1}?disable-btn :""`}
                              />
                            </a>
                          </li>

                          {renderPageNumbers({
                            type: 'formSubmission',
                            projectId: id,
                            fsxf_id: fid,
                            status: 'form-submission',
                          })}

                          <li className="page-item ">
                            <a
                              onClick={e =>
                                paginationHandler(pageNum + 1, null, {
                                  type: 'formSubmission',
                                  projectId: id,
                                  fsxf_id: fid,
                                  status: 'form-submission',
                                })
                              }
                            >
                              <i className="la la-long-arrow-right" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="card-body">
                  <div className="table-footer">
                    <div className="showing-rows">
                      <p>Sorry No Data</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <DotLoader />
          )}
        </div>
        {showConfirmation && (
          <Modal
            title={`Are you sure you want to delete this submission ${id}?`}
            toggleModal={this.cancleModel}
          >
            <div className="warning">
              <h5>Warning</h5>
            </div>
            <div>
              <p>
                "All the data within the submission will be completely
                removed. Do you still want to continue?"
              </p>
            </div>
            <div className="warning-footer text-center">
              <a
                className="fieldsight-btn rejected-btn"
                onClick={() => {
                  this.setState({ showConfirmation: false });
                }}
              >
                cancel
              </a>
              <a
                className="fieldsight-btn"
                onClick={() => this.delete(id)}
              >
                confirm
              </a>
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default WithPagination(SubmissionData);
