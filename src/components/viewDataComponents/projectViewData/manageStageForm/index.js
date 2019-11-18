import React, { Component } from 'react';
import ResponseTable from '../../responded/StagedFormResponseTable';
import DeleteTable from '../deleteTable';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getProjectViewData } from '../../../../actions/viewDataActions';

class ResponseStageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hide: true,
    };
  }

  componentDidMount() {
    if (this.props.id != '') {
      this.props.getProjectViewData(this.props.id, 'stage');
    }
  }

  toggleHide = () => {
    this.setState({
      hide: !this.state.hide,
    });
  };

  render() {
    const {
      props: {
        showViewData,
        data,
        stage_forms,
        deleted_forms,
        stage_forms_loader,
        url,
        id,
      },
    } = this;

    return (
      <React.Fragment>
        <div className="card-header main-card-header sub-card-header">
          <h5>{!data ? 'Stage Forms' : 'Rejected Submission'}</h5>
          <Link to={url}>
            <button onClick={showViewData} className="fieldsight-btn">
              {data ? 'View By Form' : 'View by Status'}
            </button>
          </Link>
        </div>
        <div className="card-body">
          {!data && (
            <ResponseTable
              stage_forms={stage_forms}
              id={id}
              loader={stage_forms_loader}
            />
          )}
        </div>
        {!!deleted_forms && deleted_forms.length > 0
          ? !data && (
              <div className="card no-boxshadow">
                <div className="card-header main-card-header sub-card-header">
                  <h5>Deleted Forms</h5>
                  <div className="dash-btn">
                    {this.state.hide ? (
                      <button
                        type="button"
                        className="btn-toggle"
                        onClick={this.toggleHide}
                      >
                        show
                        <div className="handle"></div>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-toggle"
                        onClick={this.toggleHide}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          textAlign: 'left',
                        }}
                      >
                        hide
                        <div
                          className="handle"
                          style={{ left: 'auto', right: '0.1875rem' }}
                        ></div>
                      </button>
                    )}
                  </div>
                </div>
                <div className="card-body">
                  {!this.state.hide && (
                    <DeleteTable
                      id={id}
                      deleted_forms={deleted_forms}
                      loader={stage_forms_loader}
                    />
                  )}
                </div>
              </div>
            )
          : ''}
      </React.Fragment>
    );
  }
}
//export default ResponseStageForm;
const mapStateToProps = ({ projectViewData }) => {
  const {
    stage_forms,
    deleted_forms,
    stage_forms_loader,
  } = projectViewData;

  return {
    stage_forms,
    deleted_forms,
    stage_forms_loader,
  };
};
export default compose(
  connect(mapStateToProps, {
    getProjectViewData,
  }),
)(ResponseStageForm);
