import React, { Component } from "react";
import axios from "axios";

import { DotLoader } from "../myForm/Loader";
import Modal from "../common/Modal";
import RightContentCard from "../common/RightContentCard";
import GlobalModalForm from "./GlobalModalForm";
import { errorToast, successToast } from "../../utils/toastHandler";
import EditFormGuide from "./EditFormGuide";
import AddForm from "./AddForm";
import GeneralFormTable from "./GeneralFormTable";
import ManageModal from "./ManageModal";

class GeneralForms extends Component {
  _isMounted = false;
  state = {
    id: this.props.match.params ? this.props.match.params.id : "",
    data: [],
    deployStatus: false,
    editGuide: false,
    guideData: {},
    editFormId: "",
    showFormModal: false,
    activeTab: "myForms",
    formData: {},
    xf: "",
    loader: false,
    loaded: 0,
    formId: "",
    formTitle: "",
    isProjectForm: "",
    myFormList: this.props.myForms,
    projectFormList: this.props.projectForms,
    sharedFormList: this.props.sharedForms,
    isEditForm: false
  };

  requestGeneralForm(id, checkUrl) {
    const apiUrl = checkUrl
      ? `fv3/api/manage-forms/general/?project_id=${id}`
      : `fv3/api/manage-forms/general/?site_id=${id}`;

    axios
      .get(apiUrl)
      .then(res => {
        if (this._isMounted) {
          this.setState({ data: res.data, loader: false });
        }
      })
      .catch(err => {
        const errors = err.response;
        errorToast(errors.data.error);
      });
  }

  componentDidMount() {
    this._isMounted = true;
    const {
      match: {
        url,
        params: { id }
      }
    } = this.props;
    const splitArr = url.split("/");
    const isProjectForm = splitArr.includes("project");
    const isSiteForm = splitArr.includes("site");
    if (isProjectForm) {
      this.setState(
        {
          loader: true,
          isProjectForm
        },
        this.requestGeneralForm(id, true)
      );
    } else if (isSiteForm) {
      this.setState(
        {
          loader: true,
          isProjectForm: false
        },
        this.requestGeneralForm(id, false)
      );
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.myForms != this.props.myForms) {
      this.setState({
        myFormList: this.props.myForms
      });
    } else if (nextProps.projectForms != this.props.projectForms) {
      this.setState({
        projectFormList: this.props.projectForms
      });
    } else if (nextProps.sharedForms != this.props.sharedForms) {
      this.setState({
        sharedFormList: this.props.sharedForms
      });
    }
  }

  changeDeployStatus = (formId, isDeploy) => {
    const { id, isProjectForm } = this.state;
    const deployUrl = !!isProjectForm
      ? `fv3/api/manage-forms/deploy/?project_id=${id}&type=general&id=${formId}`
      : `fv3/api/manage-forms/deploy/?site_id=${id}&type=general&id=${formId}`;
    axios
      .post(deployUrl, { is_deployed: !isDeploy })
      .then(res => {
        this.setState(
          state => {
            const newData = this.state.data;
            newData.map(each => {
              const arrItem = { ...each };

              if (each.id == formId) {
                each.is_deployed = !isDeploy;
              }
              return arrItem;
            });
            return { data: newData };
          },
          () => {
            successToast("Deploy Status", "updated");
          }
        );
      })
      .catch(err => {
        const errors = err.response;
        errorToast(errors.data.error);
      });
  };
  deleteItem = (formId, isDeploy) => {
    const { id, isProjectForm } = this.state;
    const deleteUrl = !!isProjectForm
      ? `fv3/api/manage-forms/delete/?project_id=${id}&type=general&id=${formId}`
      : `fv3/api/manage-forms/delete/?site_id=${id}&type=general&id=${formId}`;
    axios
      .post(deleteUrl, { is_deployed: isDeploy })
      .then(res => {
        this.setState(
          {
            data: this.state.data.filter(each => each.id != formId)
          },
          () => {
            successToast("Form", "deleted");
          }
        );
      })
      .catch(err => {
        const errors = err.response;
        errorToast(errors.data.error);
      });
  };
  handleEditGuide = (data, formId) => {
    this.setState({
      editGuide: !this.state.editGuide,
      guideData: data ? data : {},
      editFormId: formId
    });
  };
  handleUpdateGuide = data => {
    const { id, editFormId } = this.state;
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.text) formData.append("text", data.text);
    if (data.pdf) formData.append("pdf", data.pdf);
    if (data.is_pdf) formData.append("is_pdf", data.is_pdf);
    if (editFormId) formData.append("fsxf", editFormId);
    if (data.images && data.images.length > 0) {
      data.images.map((each, i) => {
        if (!each.image) formData.append(`new_images_${i + 1}`, each);
      });
    }
    if (data.id) {
      formData.append("id", data.id);
    }
    axios
      .post(`forms/api/save_educational_material/`, formData)
      .then(res => {
        if (res.data) {
          this.setState(
            state => {
              const item = this.state.data;
              item.map(each => {
                const newItem = { ...each };
                if (each.id == editFormId) {
                  each.em = res.data;
                }
                return newItem;
              });

              return {
                editGuide: false,
                data: item
              };
            },
            () => {
              successToast("form", "updated");
            }
          );
        }
      })
      .catch(err => {
        const errors = err.response;
        errorToast(errors.data.error);
      });
  };
  handleClosePopup = () => {
    this.setState({
      formTitle: "",
      formId: "",
      showFormModal: false,
      activeTab: "myForms",
      myFormList: this.props.myForms,
      projectFormList: this.props.projectForms,
      sharedFormList: this.props.sharedForms,
      xf: ""
    });
    this.props.closePopup();
  };

  handleCreateGeneralForm = data => {
    const { id, xf, isEditForm, isProjectForm } = this.state;
    if (!isEditForm) {
      const postUrl = !!isProjectForm
        ? `fv3/api/manage-forms/general/?project_id=${id}`
        : `fv3/api/manage-forms/general/?site_id=${id}`;
      const payload = {
        xf: xf,
        default_submission_status: data.status,
        setting: {
          types:
            !!data.typeSelected && data.typeSelected.length > 0
              ? data.typeSelected.map(each => each.id)
              : [],
          regions:
            !!data.regionSelected && data.regionSelected.length > 0
              ? data.regionSelected.map(each => each.id)
              : [],
          donor_visibility: data.isDonor,
          can_edit: data.isEdit,
          can_delete: data.isDelete
        }
      };
      axios
        .post(postUrl, payload)
        .then(res => {
          this.setState(
            {
              data: [...this.state.data, res.data]
            },
            () => {
              this.props.closePopup();
              successToast("form ", "added");
            }
          );
        })
        .catch(err => {
          const errors = err.response;
          errorToast(errors.data.error);
        });
    } else {
      const updateUrl = !!isProjectForm
        ? `fv3/api/manage-forms/general/${data.id}/?project_id=${id}`
        : `fv3/api/manage-forms/general/${data.id}/?site_id=${id}`;
      const payload = {
        id: data.id,
        default_submission_status: data.status,
        responses_count: 0,
        em: data.em,
        is_deployed: data.isDeploy,
        setting: {
          id: data.settingId,

          can_edit: data.isEdit,
          donor_visibility: data.isDonor,
          regions:
            !!data.regionSelected && data.regionSelected.length > 0
              ? data.regionSelected.map(each => each.id)
              : [],
          can_delete: data.isDelete,
          types:
            !!data.typeSelected && data.typeSelected.length > 0
              ? data.typeSelected.map(each => each.id)
              : []
        }
      };

      axios
        .put(updateUrl, payload)
        .then(res => {
          this.setState(
            state => {
              const arr = this.state.data;
              const newArr = arr.map(item => {
                if (item.id == res.data.id) {
                  return res.data;
                } else {
                  return item;
                }
              });
              return {
                data: newArr
              };
            },
            () => {
              this.handleClosePopup();
              successToast("form", "updated");
            }
          );
        })
        .catch(err => {
          const errors = err.response;
          errorToast(errors.data.error);
        });
    }
  };

  handleEditGeneralForm = data => {
    this.setState(
      {
        formData: data,
        isEditForm: true,
        formTitle: data.xf.title
      },
      () => {
        this.props.commonPopupHandler();
      }
    );
  };

  toggleFormModal = () => {
    this.setState({ showFormModal: !this.state.showFormModal });
  };

  toggleTab = tab => {
    this.setState({
      activeTab: tab,
      myFormList: this.props.myForms,
      sharedFormList: this.props.sharedForms,
      projectFormList: this.props.projectForms
    });
  };

  onChangeHandler = async e => {
    const { activeTab } = this.state;
    const searchValue = e.target.value;

    if (searchValue) {
      if (activeTab == "myForms") {
        const filteredData = await this.props.myForms.filter(form => {
          return (
            form.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            form.owner.toLowerCase().includes(searchValue.toLowerCase())
          );
        });

        this.setState({
          myFormList: filteredData
        });
      } else if (activeTab == "projectForms") {
        const awaitedData = await this.props.projectForms.map(project => {
          const filteredData = project.forms.filter(form => {
            return (
              form.title.toLowerCase().includes(searchValue.toLowerCase()) ||
              form.owner.toLowerCase().includes(searchValue.toLowerCase())
            );
          });
          return { ...project, forms: filteredData };
        });
        this.setState({
          projectFormList: awaitedData
        });
      } else if (activeTab == "sharedForms") {
        const filteredData = await this.props.sharedForms.filter(form => {
          return (
            form.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            form.owner.toLowerCase().includes(searchValue.toLowerCase())
          );
        });

        this.setState({
          sharedFormList: filteredData
        });
      }
    } else {
      this.setState({
        myFormList: this.props.myForms,
        sharedFormList: this.props.sharedForms,
        projectFormList: this.props.projectForms
      });
    }
  };
  handleMyFormChange = (e, title) => {
    this.setState({
      formId: e.target.value,
      formTitle: title
    });
  };
  handleSaveForm = () => {
    this.setState({
      xf: this.state.formId,
      showFormModal: !this.state.showFormModal
    });
  };

  render() {
    const {
      state: {
        loader,
        data,
        editGuide,
        guideData,
        showFormModal,
        activeTab,
        formData,
        formTitle,
        myFormList,
        projectFormList,
        sharedFormList,
        isEditForm,
        isProjectForm
      },
      props: { typeOptions, regionOptions },
      handleClosePopup
    } = this;
    // console.log("in render", isProjectForm);

    return (
      <div className="col-xl-9 col-lg-8">
        <RightContentCard
          title="General Forms"
          addButton={true}
          toggleModal={this.props.commonPopupHandler}
          showText={true}
        >
          {loader && <DotLoader />}
          {!loader && !!isProjectForm && (
            <GeneralFormTable
              data={data}
              loader={loader}
              handleEditGuide={this.handleEditGuide}
              changeDeployStatus={this.changeDeployStatus}
              deleteItem={this.deleteItem}
              handleEditForm={this.handleEditGeneralForm}
              formTable="project"
            />
          )}
          {!loader && !isProjectForm && (
            <GeneralFormTable
              data={data}
              loader={loader}
              handleEditGuide={this.handleEditGuide}
              changeDeployStatus={this.changeDeployStatus}
              deleteItem={this.deleteItem}
              handleEditForm={this.handleEditGeneralForm}
              formTable="site"
            />
          )}
          {this.props.popupModal && (
            <Modal
              title="Add General Form"
              toggleModal={handleClosePopup}
              classname="md-body"
              // handleSubmit={this.handleCreateGeneralForm}
            >
              <GlobalModalForm
                formType="general"
                regionOptions={regionOptions}
                typeOptions={typeOptions}
                myForms={this.props.myForms}
                projectForms={this.props.projectForms}
                sharedForms={this.props.sharedForms}
                toggleFormModal={this.toggleFormModal}
                handleToggleForm={handleClosePopup}
                formTitle={formTitle}
                handleCreateForm={this.handleCreateGeneralForm}
                formData={formData}
                isEditForm={isEditForm}
                isProjectWide={false}
              />
            </Modal>
          )}
          {editGuide && (
            <Modal title="Form Guide" toggleModal={this.handleEditGuide}>
              <EditFormGuide
                data={guideData}
                handleCancel={this.handleEditGuide}
                handleUpdateGuide={this.handleUpdateGuide}
                handleCreateGuide={this.handleCreateGuide}
              />
            </Modal>
          )}
          {showFormModal && (
            <ManageModal
              title="Add Form"
              toggleModal={this.toggleFormModal}
              showButton={true}
              showText="Create Form"
              url="/forms/create/"
              classname="manage-body md-body"
              handleSubmit={this.handleSaveForm}
            >
              <AddForm
                activeTab={activeTab}
                toggleTab={this.toggleTab}
                onChangeHandler={this.onChangeHandler}
                formList={myFormList}
                projectList={projectFormList}
                sharedList={sharedFormList}
                handleRadioChange={this.handleMyFormChange}
                // handleSaveForm={this.handleSaveForm}
                loader={this.props.formLoader}
              />
            </ManageModal>
          )}
        </RightContentCard>
      </div>
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}
export default GeneralForms;
