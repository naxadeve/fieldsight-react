import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import Loader from '../common/Loader';
import {
  getReportsList,
  getProjectData,
} from '../../actions/reportActions';
import { errorToast, successToast } from '../../utils/toastHandler';
import Modal from '../common/Modal';
import ShareModal from './shareModal';
import DeleteModal from '../common/DeleteModal';
/* eslint-disable */

class MyReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportList: [],
      openShare: false,
      Shareid: '',
      deleteId: '',
      openDelete: false,
    };
  }

  componentWillMount() {
    const { id } = this.props;
    this.props.getReportsList(id, 'my_reports');
    this.props.getProjectData(id);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.reportReducer.reportList !==
      this.props.reportReducer.reportList
    ) {
      this.setState({
        reportList: this.props.reportReducer.reportList,
      });
    }
  }

  handle = id => {
    const { reportList } = this.state;
    axios
      .post(
        `/v4/api/reporting/report-action/${id}/?action_type=add_to_templates`,
      )
      .then(res => {
        if (res.status === 200) {
          const removeTemplate = reportList.filter(
            tem => id !== tem.id,
          );
          this.setState(
            {
              reportList: removeTemplate,
            },
            () => successToast(res.data.detail),
          );
        }
      })
      .catch(err => {
        const error = err.response.data;
        Object.entries(error).map(([key, value]) => {
          return errorToast(`${value}`);
        });
      });
  };

  deleteAction = () => {
    const { reportList, deleteId } = this.state;
    axios
      .delete(`/v4/api/reporting/report/${deleteId}/`)
      .then(res => {
        if (res.status === 204) {
          const delet = reportList.filter(
            data => deleteId !== data.id,
          );

          this.setState(
            {
              reportList: delet,
              openDelete: false,
            },
            () => successToast('Sucessfully', 'deleted'),
          );
        }
        // successToast(res.data.detail);
      })
      .catch(err => {
        const error = err.response.data;
        Object.entries(error).map(([key, value]) => {
          return errorToast(`${value}`);
        });
      });
  };

  ShareAction = Shareid => {
    this.setState(prevState => ({
      openShare: !prevState.openShare,
      Shareid,
    }));
  };

  shareCloseButton = () => {
    this.setState(prevState => ({
      openShare: !prevState.openShare,
      Shareid: '',
    }));
  };

  deleteHandler = deleteId => {
    this.setState(prevState => ({
      deleteId,
      openDelete: !prevState.openDelete,
    }));
  };

  closeDeleteHandler = deleteId => {
    this.setState(prevState => ({
      openDelete: !prevState.openDelete,
    }));
  };

  render() {
    const {
      state: { reportList, openShare, Shareid, openDelete },
      deleteAction,
      closeDeleteHandler,
    } = this;

    const {
      toggleSection,
      reportReducer: { reportLoader, projectList },
      id,
    } = this.props;
    const DataCrude = [
      {
        id: '1',
        title: 'Edit',
        link: `/fieldsight/application/#/project/${id}/edit-report/`,
      },
      {
        id: '2',
        title: 'Add to template',
        action: this.handle,
      },
      {
        id: '3',
        title: 'Share',
        actionShare: this.ShareAction,
      },
      {
        id: '4',
        title: 'Delete',
        actionDelete: this.deleteAction,
      },
    ];

    return (
      <>
        <div className="card-body">
          {reportLoader && <Loader />}
          {!reportLoader &&
            reportList.length > 0 &&
            reportList.map(report => (
              <div className="report-list" key={report.id}>
                <Link
                  className="row"
                  to={{
                    pathname: `/report-dashboard/${report.id}`,

                    state: {
                      title: report.title,
                      attributes: report.attributes,
                    },
                  }}
                >
                  <div className="col-md-8">
                    <div className="report-content">
                      <h4>{report.title}</h4>
                      <p>{report.description}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="report-share-time">
                      <div className="report-item created-time">
                        <h6>Date Created</h6>
                        <p>
                          {format(report.created_at, [
                            'MMMM Do YYYY',
                          ])}
                        </p>
                        <time>
                          {format(report.created_at, ['h:mm a'])}
                        </time>
                      </div>
                      {report.shared_with.length > 0 &&
                        report.shared_with.map(() => (
                          <div className="report-item share-report">
                            <h6>Shared with</h6>
                            <ul className="shared-list">
                              <li>Santosh khanal</li>
                              <li>Jasica standford</li>
                              <li>Khusbu basnet</li>
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                </Link>
                <div className="dropdown report-option">
                  <Dropdown drop="left">
                    <Dropdown.Toggle
                      variant=""
                      id="dropdown-Data"
                      className="dropdown-toggle common-button no-border is-icon"
                    >
                      <i className="material-icons">more_vert</i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                      {DataCrude.map(item => (
                        <div key={item.id}>
                          {item.link && (
                            <Dropdown.Item
                              href={`${item.link}${report.id}`}
                              key={item.id}
                              // target="_blank"
                            >
                              {item.title}
                            </Dropdown.Item>
                          )}

                          {item.action && (
                            <Dropdown.Item
                              onClick={() => this.handle(report.id)}
                              // target="_blank"
                            >
                              {item.title}
                            </Dropdown.Item>
                          )}

                          {item.actionDelete && (
                            <Dropdown.Item
                              onClick={() =>
                                this.deleteHandler(report.id)
                              }
                              // target="_blank"
                            >
                              {item.title}
                            </Dropdown.Item>
                          )}

                          {item.actionShare && (
                            <Dropdown.Item
                              onClick={() =>
                                this.ShareAction(report.id)
                              }
                              // target="_blank"
                            >
                              {item.title}
                            </Dropdown.Item>
                          )}
                        </div>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            ))}
          {!reportLoader && reportList.length === 0 && (
            <div>No Report Found Yet.</div>
          )}
        </div>
        {openShare && (
          <Modal
            title="Share Form"
            toggleModal={this.shareCloseButton}
          >
            <ShareModal
              forms={projectList}
              Shareid={Shareid}
              shareCloseButton={this.shareCloseButton}
            />
          </Modal>
        )}

        {openDelete && (
          <DeleteModal
            onCancel={closeDeleteHandler}
            onConfirm={deleteAction}
            onToggle={closeDeleteHandler}
            message="Are u sure you want to delete?"
          />
        )}
      </>
    );
  }
}

const mapStateToProps = ({ reportReducer }) => ({
  reportReducer,
});
export default connect(mapStateToProps, {
  getReportsList,
  getProjectData,
})(MyReports);
