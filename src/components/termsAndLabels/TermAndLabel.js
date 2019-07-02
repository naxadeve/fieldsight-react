import React, { Component, Fragment } from "react";
import axios from "axios";
import InputElement from "../common/InputElement";
import RightContentCard from "../common/RightContentCard";
import Table from "../common/Table";
import Loader, { DotLoader } from "../common/Loader";

import { successToast, errorToast } from "../../utils/toastHandler";
import { RegionContext } from "../../context";
import isEmpty from "../../utils/isEmpty";

const tableHeader = {
  termsAndLabels: ["Terms And Labels", "Changed To"]
};

const url = "fv3/api/project-terms-labels/";

export default class TermAndLabel extends Component {
  static contextType = RegionContext;

  state = {
    termsAndLabels: {
      id: "",
      donor: "",
      site: "",
      site_supervisor: "",
      site_reviewer: "",
      region: "",
      region_supervisor: "",
      region_reviewer: "",
      project: ""
    },
    showList: true,
    isLoading: false,
    dotLoader: true
  };

  requestHandler = async () => {
    try {
      const {
        termsAndLabels: {
          id,
          donor,
          site,
          site_supervisor,
          site_reviewer,
          region,
          region_supervisor,
          region_reviewer,
          project
        }
      } = this.state;

      const termsAndLabels = {
        donor,
        site,
        site_supervisor,
        site_reviewer,
        region,
        region_supervisor,
        region_reviewer,
        project
      };
      debugger;
      if (id) {
        await axios.put(`${url}${id}/`, termsAndLabels);
        await this.setState({
          isLoading: false
        });

        successToast("Terms and Labels", "updated");
        return this.context.updateTerms(termsAndLabels);
      }

      await axios.post(`${url}?project=${project}`, termsAndLabels);
      await this.setState({
        isLoading: false
      });
      successToast("Terms and Labels", "added");
      this.context.updateTerms(termsAndLabels);
    } catch (error) {
      await this.setState({
        isLoading: false
      });
      errorToast();
    }
  };

  onSubmitHandler = e => {
    e.preventDefault();
    this.setState(
      {
        isLoading: true
      },
      this.requestHandler
    );
  };

  onChangeHandler = e => {
    const { name, value } = e.target;

    this.setState({
      termsAndLabels: {
        ...this.state.termsAndLabels,
        [name]: value
      }
    });
  };

  componentDidMount() {
    const { projectId, terms } = this.context;

    if (!isEmpty(terms)) {
      this.setState({
        termsAndLabels: { ...terms, project: projectId },
        dotLoader: false
      });
    }
  }

  componentDidUpdate() {
    const {
      state: {
        termsAndLabels: { project, ...restLabels }
      },
      context: { projectId, terms }
    } = this;

    const isStateTermsEmpty =
      Object.values(restLabels).filter(Boolean).length === 0;

    if (isStateTermsEmpty) {
      this.setState({
        termsAndLabels: { ...terms, project: projectId },
        dotLoader: false
      });
    }
  }

  editHandler = () => {
    this.setState({
      showList: false
    });
  };

  listHandler = () => {
    this.setState({
      showList: true
    });
  };

  render() {
    const {
      state: {
        termsAndLabels: {
          donor,
          site,
          site_supervisor,
          site_reviewer,
          region,
          region_supervisor,
          region_reviewer
        },
        showList,
        isLoading,
        dotLoader
      },
      listHandler,
      editHandler,
      onChangeHandler,
      onSubmitHandler
    } = this;

    const { id, project, ...restLabels } = this.state.termsAndLabels;
    return (
      <Fragment>
        <RightContentCard title="Terms And Labels">
          {dotLoader && <DotLoader />}
          {!dotLoader && !showList && (
            <Fragment>
              <form className="edit-form" onSubmit={onSubmitHandler}>
                <div className="row">
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      required={true}
                      label="Donor"
                      name="donor"
                      value={donor}
                      changeHandler={onChangeHandler}
                    />
                  </div>

                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      required={true}
                      label="Site"
                      name="site"
                      value={site}
                      changeHandler={onChangeHandler}
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      required={true}
                      label="Site Supervisor"
                      name="site_supervisor"
                      value={site_supervisor}
                      changeHandler={onChangeHandler}
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      required={true}
                      label="Site Reviewer"
                      name="site_reviewer"
                      value={site_reviewer}
                      changeHandler={onChangeHandler}
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <InputElement
                      formType="editForm"
                      tag="input"
                      type="text"
                      required={true}
                      label="Region"
                      name="region"
                      value={region}
                      changeHandler={onChangeHandler}
                    />
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <div className="form-group">
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="text"
                        required={true}
                        label="Region Supervisor"
                        name="region_supervisor"
                        value={region_supervisor}
                        changeHandler={onChangeHandler}
                      />
                    </div>
                  </div>
                  <div className="col-xl-4 col-md-6">
                    <div className="form-group">
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="text"
                        required={true}
                        label="Region Reviewer"
                        name="region_reviewer"
                        value={region_reviewer}
                        changeHandler={onChangeHandler}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  <button type="submit" className="fieldsight-btn pull-right">
                    Save
                  </button>
                </div>
              </form>
              <button className="fieldsight-btn" onClick={listHandler}>
                See List
              </button>
            </Fragment>
          )}
          {!dotLoader && showList && (
            <Fragment>
              <Table
                page="termsAndLabels"
                tableHeader={tableHeader.termsAndLabels}
                tableRow={Object.entries(restLabels)}
              />
              <button className="fieldsight-btn" onClick={editHandler}>
                Edit
              </button>
            </Fragment>
          )}
        </RightContentCard>
        {isLoading && <Loader />}
      </Fragment>
    );
  }
}
