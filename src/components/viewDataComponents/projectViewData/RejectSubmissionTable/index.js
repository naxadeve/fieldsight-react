import React, { Component } from 'react';
import StatusTable from '../../responded/StatusTable';
import axios from 'axios';
import WithPagination from '../../../../hoc/WithPagination';
import { Link } from 'react-router-dom';
import { DotLoader } from '../../../myForm/Loader';
import { FormattedMessage } from 'react-intl';

class RejectedTable extends Component {
  componentDidMount() {
    if (this.props.id) {
      this.props.paginationHandler(1, null, {
        type: 'viewByStatus',
        projectId: this.props.id,
        status: 'rejected',
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.breadcrumbs !== this.props.breadcrumbs) {
      this.props.handleBreadCrumb(this.props.breadcrumbs);
    }
  }

  render() {
    const {
      props: {
        data,
        showViewData,
        dLoader,
        url,
        siteList,
        fromData,
        toData,
        totalCount,
        pageNum,
        paginationHandler,
        renderPageNumbers,
        id,
      },
    } = this;

    return (
      <>
        <div className="card-header main-card-header sub-card-header">
          {/*<h5>Rejected Submissions</h5>*/}
          <h5>
            <FormattedMessage
              id="app.rejected-submissions"
              defaultMessage="Rejected Submissions"
            />
          </h5>
          <div className="dash-btn">
            <Link to={this.props.url}>
              <button
                onClick={showViewData}
                className="fieldsight-btn"
              >
                {data ? (
                  <FormattedMessage
                    id="app.view-by-status"
                    defaultMessage="View By Status"
                  />
                ) : (
                  <FormattedMessage
                    id="app.view-by-status"
                    defaultMessage="View By Status"
                  />
                )}
              </button>
            </Link>
          </div>
        </div>
        {dLoader === false ? (
          <>
            <div className="card-body">
              <StatusTable submission={siteList} />
            </div>

            {siteList && siteList.length > 0 ? (
              <div className="card-body">
                <div className="table-footer">
                  <div className="showing-rows">
                    <p>
                      Showing
                      <span>{fromData}</span>
                      to
                      <span>
                        {toData > totalCount ? totalCount : toData}
                      </span>
                      of
                      <span>{totalCount}</span>
                      entries.
                    </p>
                  </div>
                  {toData < totalCount ? (
                    <div className="table-pagination">
                      <ul>
                        <li className="page-item">
                          <a
                            href="#"
                            onClick={() => {
                              paginationHandler(pageNum - 1, null, {
                                projectId: id,
                              });
                            }}
                          >
                            <i className="la la-long-arrow-left" />
                          </a>
                        </li>

                        {renderPageNumbers({
                          type: 'viewByStatus',
                          projectId: id,
                          status: 'flagged',
                        })}

                        <li className="page-item ">
                          <a
                            href="#"
                            onClick={() => {
                              paginationHandler(pageNum + 1, null, {
                                projectId: id,
                              });
                            }}
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
          </>
        ) : (
          <DotLoader />
        )}
      </>
    );
  }
}
RejectedTable.propTypes = {
  id: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.objectOf.isRequired,
  url: PropTypes.string.isRequired,
  showViewData: PropTypes.func.isRequired,
  siteList: PropTypes.arrayOf.isRequired,
  fromData: PropTypes.number.isRequired,
  toData: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageNum: PropTypes.number.isRequired,
  renderPageNumbers: PropTypes.func.isRequired,
  dLoader: PropTypes.bool.isRequired,
  paginationHandler: PropTypes.func.isRequired,
  data: PropTypes.objectOf.isRequired,
  handleBreadCrumb: PropTypes.func.isRequired,
};
export default WithPagination(RejectedTable);
