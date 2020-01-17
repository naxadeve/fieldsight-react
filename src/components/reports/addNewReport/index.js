import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import { Dropdown } from 'react-bootstrap';

import {
  getMetricsData,
  getForms,
  getFormQuestions,
  applyActionToReport,
  getReportData,
} from '../../../actions/reportActions';
// import { BlockContentLoader } from '../../common/Loader';
import InputElement from '../../common/InputElement';
import {
  errorToast,
  successToast,
} from '../../../utils/toastHandler';
import CustomSelect from '../common/CustomSelect';
import Metrics from './metrics';
import DataFilter from './dataFilter';
import SelectedColumn from './selectedColumn';
import DeleteModal from '../../common/DeleteModal';

/* eslint-disable */

const InitialState = {
  data: {
    reportName: '',
    desc: '',
    selectedReportType: '',
    selectedMetrics: [],
  },
  formInfo: {
    selectedFormType: '',
    selectedForm: '',
    selectedIndividualForm: [],
    selectedQuestions: [],
    formValue: [],
    selectedFormValue: [],
  },
  siteInfo: {
    selectedMetas: [],
    siteValues: [],
    selectedValue: [
      {
        category: 'site_information',
        code: 'actual',
        types: [0],
        label: 'Actual',
      },
    ],
  },
  reportType: [],
  metrics: [],
  metricArr: [],
  siteInfoArr: [],
  formInfoArr: [],
  formTypeArr: [],
  filterArr: [],
  usersArr: [],
  individualFormArr: [],
  toggleSelectClass: {
    reportType: false,
    siteType: false,
    siteValue: false,
    formType: false,
    formValue: false,
    formQuestSelect: false,
    submissionCount: false,
    filterRegion: false,
    filterSiteType: false,
  },
  collapseClass: false,
  // loader: false,
  submissionType: {},
  submissions: [],
  userList: [],
  metaAttributes: [],

  formQuestions: [],
  filter: {
    filterByRegions: [{ id: 'all_regions', name: 'Select All' }],
    filterBySiteType: [{ id: 'all_sitetypes', name: 'Select All' }],
    filterBy: {},
  },
  isDelete: false,
  showActions: false,
  errors: {},
};

class AddNewReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...InitialState,
      applyFilter: false,
      reportId: '',
      projectId: '',
    };
  }

  componentWillMount() {
    const {
      match: {
        params: { id, reportId },
      },
    } = this.props;
    this.setState({ projectId: id }, () => {
      if (reportId) {
        this.setState({ reportId }),
          this.props.getReportData(reportId);
      }
      this.props.getMetricsData(id);
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.reportReducer.reportTypes !==
      this.props.reportReducer.reportTypes
    ) {
      this.setState({
        reportType: this.props.reportReducer.reportTypes,
      });
    }
    if (
      prevProps.reportReducer.metrics !==
      this.props.reportReducer.metrics
    ) {
      this.setState(
        { metrics: this.props.reportReducer.metrics },
        () => {
          if (this.state.metrics.length > 0) {
            this.setArrays();
          }
        },
      );
    }
    if (
      prevProps.reportReducer.metaAttributes !==
      this.props.reportReducer.metaAttributes
    ) {
      this.setState({
        metaAttributes: this.props.reportReducer.metaAttributes,
      });
    }
    if (
      prevProps.reportReducer.regions !==
      this.props.reportReducer.regions
    ) {
      this.setState(state => ({
        filter: {
          ...state.filter,
          filterByRegions: [
            ...state.filter.filterByRegions,
            ...this.props.reportReducer.regions,
          ],
        },
      }));
    }
    if (
      prevProps.reportReducer.siteTypes !==
      this.props.reportReducer.siteTypes
    ) {
      this.setState(state => ({
        filter: {
          ...state.filter,
          filterBySiteType: [
            ...state.filter.filterBySiteType,
            ...this.props.reportReducer.siteTypes,
          ],
        },
      }));
    }
    if (
      prevProps.reportReducer.actionResponse !==
      this.props.reportReducer.actionResponse
    ) {
      const msg = this.props.reportReducer.actionResponse.detail;
      successToast(msg);
    }
    if (
      prevProps.reportReducer.reportData !==
      this.props.reportReducer.reportData
    ) {
      const {
        match: {
          params: { id, reportId },
        },
        location: { fromRow },
      } = this.props;
      //   // this.setState({ loader: true }, () => {
      if (reportId) {
        const report = this.props.reportReducer.reportData;
        const userList = report.attributes.filter(
          r => r.category === 'users',
        );
        const submissions = report.attributes.filter(
          r => r.category === 'default',
        );
        const filterBy = report.filter;

        const objLen = Object.entries(filterBy).map(e => {
          if (e[1].length > 0) {
            return true;
          }
          return false;
        });
        const showActions = objLen.includes(true) ? true : false;

        const filterToSiteInfo = report.attributes.filter(r => {
          if (r.value && !r.value.selectedForm) {
            return true;
          }
          return false;
        });
        const filterToFormInfo = report.attributes.filter(r => {
          if (r.value && !!r.value.selectedForm) {
            return true;
          }
          return false;
        });

        let selectedFormType = {};
        let selectedForm = {};
        let selectedIndividualForm = [];
        const selectedQuestions = [];
        const selectedFormValue = [];
        const selectedMetas = [];
        const selectedValue = [];
        filterToSiteInfo.length > 0 &&
          filterToSiteInfo.map(f => {
            const { code, type, id, value, label } = f;
            if (selectedMetas.length === 0) {
              selectedMetas.push({ code, type, id, label });
            }
            if (selectedMetas.length > 0) {
              const find = selectedMetas.some(
                some => some.code === code,
              );

              if (!find) {
                selectedMetas.push({
                  code,
                  type,
                  id,
                  label,
                });
              }
            }

            if (selectedValue.length === 0) {
              selectedValue.push({ ...value });
            }

            if (selectedValue.length > 0) {
              selectedValue.map(s => {
                if (s.code !== value.code) {
                  selectedValue.push({ ...value });
                }
              });
            }
          });

        if (filterToFormInfo.length > 0) {
          const newArr = filterToFormInfo.filter(
            each => each.value && each.value.selectedIndividualForm,
          );
          const { value, ...rest } = newArr[0];
          selectedFormType = { ...rest };
          selectedForm = value.selectedForm;
          newArr.map(newItem => {
            const { code, value } = newItem;
            if (selectedIndividualForm.length === 0) {
              selectedIndividualForm.push({
                type: code,
                form: value.selectedForm.id,
                metrics: [{ ...value.selectedIndividualForm }],
              });
            } else {
              selectedIndividualForm.map(ind => {
                const { type, form, metrics } = ind;
                if (type === code) {
                  if (form === value.selectedForm.id) {
                    // debugger;
                    selectedIndividualForm.push({
                      type,
                      form,
                      metrics: [
                        ...metrics,
                        { ...value.selectedIndividualForm },
                      ],
                    });
                  } else {
                    selectedIndividualForm.push({
                      type,
                      form: value.selectedForm.id,
                      metrics: [{ ...value.selectedIndividualForm }],
                    });
                  }
                } else {
                  selectedIndividualForm.push({
                    type: code,
                    form: value.selectedForm.id,
                    metrics: [{ ...value.selectedIndividualForm }],
                  });
                }
              });
            }
          });
          // filterToFormInfo.map(f => {
          //   const {code, id, label, value} =f
          //   if (value.selectedIndividualForm) {

          //   }
          // })

          // if (value.selectedQuestion) {
          //   const { type, name, form } = value.selectedQuestion;
          //   if (selectedQuestions.length === 0) {
          //     selectedQuestions.push({ type, name });
          //   }
          //   if (selectedQuestions.length > 0) {
          //     selectedQuestions.map(q => {
          //       if (q.name !== value.selectedQuestion.name) {
          //         selectedQuestions.push({ type, name });
          //       }
          //     });
          //   }
          //   if (selectedFormValue.length === 0) {
          //     selectedFormValue.push({ ...form });
          //   }
          //   if (selectedFormValue.length > 0) {
          //     selectedFormValue.map(v => {
          //       if (v.code !== value.selectedQuestion.form.code) {
          //         selectedFormValue.push({ ...form });
          //       }
          //     });
          //   }
          // }
          // });
        }

        this.setState(state => ({
          data: {
            ...state.data,
            reportName: report.title,
            desc: report.description,
            selectedReportType: report.type,
            selectedMetrics: report.attributes,
          },
          formInfo: {
            ...state.formInfo,
            selectedFormType,
            selectedForm,
            selectedIndividualForm,
            selectedQuestions,
            selectedFormValue,
          },
          siteInfo: {
            ...state.siteInfo,
            selectedMetas,
            // selectedValue,
          },
          userList,
          submissions,
          collapseClass: fromRow ? false : true,
          applyFilter: report.attributes.length > 0 ? true : false,
          filter: {
            ...state.filter,
            filterBy,
          },
          showActions,
          // loader: false,
        }));
      }
    }
  }

  componentWillUnmount() {
    this.clearState();
  }

  clearState() {
    this.setState({ ...InitialState });
  }

  handleToggleClass = toggleFor => {
    this.setState(state => ({
      toggleSelectClass: {
        ...state.toggleSelectClass,
        [toggleFor]: !state.toggleSelectClass[toggleFor],
      },
    }));
  };

  handleAddValue = () => {
    const {
      siteInfo: { selectedMetas, selectedValue },
      data: { selectedMetrics },
    } = this.state;
    const newArr = [];
    let filteredMetrics = [];

    this.setState(state => {
      if (
        selectedMetas.length > 0 &&
        selectedValue &&
        selectedValue.length > 0
      ) {
        selectedMetas.map(meta => {
          return selectedValue.map(value => {
            return newArr.push({ ...meta, value });
          });
        });
        filteredMetrics = selectedMetrics.filter(i => {
          if (!i.value) {
            return true;
          }
          if (i.value && i.value.selectedForm) {
            return true;
          }
          return false;
        });

        const arr = [...filteredMetrics, ...newArr];
        return {
          data: {
            ...state.data,
            selectedMetrics: arr,
          },
        };
      }

      if (selectedValue && selectedValue.length === 0) {
        filteredMetrics = selectedMetrics.filter(i => {
          if (!i.value) {
            return true;
          }
          if (i.value && i.value.selectedForm) {
            return true;
          }
          return false;
        });
        return {
          data: {
            ...state.data,
            selectedMetrics: filteredMetrics,
          },
        };
      }
      if (selectedMetas && selectedMetas.length === 0) {
        filteredMetrics = selectedMetrics.filter(i => {
          if (!i.value) {
            return true;
          }
          if (i.value && i.value.selectedForm) {
            return true;
          }
          return false;
        });
        return {
          data: {
            ...state.data,
            selectedMetrics: filteredMetrics,
          },
          // siteInfo: {
          //   ...state.siteInfo,
          //   selectedValue: [],
          // },
        };
      }
      return null;
    });
  };

  handleChange = e => {
    const { name, value } = e.target;

    this.setState(
      state => ({
        data: {
          ...state.data,
          [name]: value,
        },
      }),
      () => {
        const { errors } = this.state;
        this.setState(state => {
          if (name === 'reportName' && errors[name])
            return { errors: { ...state.errors, reportName: '' } };
          if (name === 'desc' && errors[name])
            return { errors: { ...state.errors, desc: '' } };
          return null;
        });
      },
    );
  };

  handleToggleCollapse = () => {
    this.setState(({ collapseClass }) => ({
      collapseClass: !collapseClass,
    }));
  };

  handleChecKUser = (e, user) => {
    const {
      target: { name, checked },
    } = e;

    this.setState(state => {
      if (checked) {
        const newList = state.data.selectedMetrics.filter(
          i => i.code !== name,
        );
        return {
          userList: [...state.userList, user],
          data: {
            ...state.data,
            selectedMetrics: [...newList, user],
          },
        };
      }
      if (!checked) {
        const newList = state.data.selectedMetrics.filter(
          i => i.code !== name,
        );

        const filteredUser = state.userList.filter(
          u => u.code !== name,
        );
        return {
          userList: filteredUser,
          data: {
            ...state.data,
            selectedMetrics: newList,
          },
        };
      }
      return null;
    });
  };

  handleReportTypeChange = e => {
    const { value } = e.target;

    this.setState(
      state => ({
        data: {
          ...state.data,
          selectedReportType: JSON.parse(value),
          selectedMetrics: [],
        },
        submissions: [],
        userList: [],
        siteInfo: {
          ...state.siteInfo,
          selectedMetas: [],
          selectedValue: [],
          siteValues: [],
        },
        formInfo: {
          ...state.formInfo,
          selectedFormType: {},
          selectedForm: {},
          selectedQuestions: [],
          selectedFormValue: [],
          selectedIndividualForm: [],
          formValue: [],
        },
        collapseClass: true,
      }),
      () => {
        this.setArrays();
      },
    );
  };

  setArrays = () => {
    const {
      metrics,
      data: { selectedReportType },
    } = this.state;
    const metricsArr = metrics.filter(metric =>
      metric.types.includes(selectedReportType),
    );
    if (metricsArr.length > 0) {
      this.setState(
        {
          metricArr: metricsArr.filter(
            item => item.category === 'default',
          ),
          siteInfoArr: metricsArr.filter(
            item => item.category === 'site_information',
          ),
          formInfoArr: metricsArr.filter(
            item => item.category === 'form_information',
          ),
          usersArr: metricsArr.filter(
            item => item.category === 'users',
          ),
          individualFormArr: metricsArr.filter(
            item => item.category === 'individual_form',
          ),
          filterArr: metricsArr.filter(
            item => item.category === 'filter',
          ),
        },
        () => {
          const {
            formInfoArr,
            siteInfoArr,
            siteInfo: { selectedMetas },
            formInfo: { selectedQuestions },
          } = this.state;

          if (siteInfoArr.length > 0 && selectedMetas.length > 0) {
            this.setSiteValue();
          }
          if (
            formInfoArr.length > 0 &&
            selectedQuestions.length > 0
          ) {
            this.setFormValue();
          }
        },
      );
    }
  };

  handleSubmissionType = type => {
    this.setState({ submissionType: type });
  };

  handleCheckSubmissionType = e => {
    const {
      target: { name, checked },
    } = e;

    const { submissionType, data, submissions } = this.state;
    this.setState(state => {
      if (checked) {
        const newList = data.selectedMetrics.filter(
          i => i.code !== name,
        );
        return {
          submissions: [...state.submissions, submissionType],
          data: {
            ...state.data,
            selectedMetrics: [...newList, submissionType],
          },
        };
      }
      if (!checked) {
        const newList = data.selectedMetrics.filter(
          i => i.code !== name,
        );
        const filterSubmission = submissions.filter(
          type => type.code !== name,
        );
        return {
          submissions: filterSubmission,
          data: {
            ...state.data,
            selectedMetrics: newList,
          },
        };
      }
      return null;
    });
  };

  handleChangeArray = item => {
    const {
      formInfo: { selectedIndividualForm },
    } = this.state;
    this.setState(state => {
      const list = state.data.selectedMetrics;
      const filteredArr = list.filter(metric => {
        if (
          metric.code &&
          metric.value &&
          metric.value.selectedForm
        ) {
          if (metric.code === item.code) {
            if (
              metric.value.selectedIndividualForm &&
              item.value.selectedIndividualForm
            ) {
              if (
                metric.value.selectedIndividualForm.code !==
                item.value.selectedIndividualForm.code
              ) {
                return true;
              }
              return false;
            }
            if (
              metric.value.selectedQuestion &&
              item.value.selectedQuestion
            ) {
              if (
                metric.value.selectedQuestion.name ===
                item.value.selectedQuestion.name
              ) {
                if (
                  metric.value.selectedQuestion.form.code !==
                  item.value.selectedQuestion.form.code
                ) {
                  return true;
                }
                return false;
              }
            }
          }
          return true;
        }
        if (
          metric.code &&
          metric.value &&
          !metric.value.selectedForm
        ) {
          if (metric.code === item.code) {
            if (metric.value.code !== item.value.code) {
              return true;
            }
            return false;
          }
          return true;
        }
        if (metric.code && !metric.value) {
          if (metric.code !== item.code) {
            return true;
          }
          return false;
        }
        return null;
      });

      const metaList = [];
      filteredArr.map(f => {
        if (f.value && !f.value.selectedForm) {
          metaList.push(f.code);
        }
      });
      const filteredSelectedMetas = state.siteInfo.selectedMetas.filter(
        m => metaList.includes(m.code),
      );

      const filteredMetaArr = state.siteInfo.selectedValue.filter(
        v => {
          return filteredArr.map(f => {
            if (f.value && !f.value.selectedForm) {
              if (f.value.code === v.code) {
                return true;
              }
              return false;
            }
          });
        },
      );

      const filteredUserArr = state.userList.filter(
        u => u.code !== item.code,
      );

      const filteredSubmissionArr = state.submissions.filter(
        s => s.code !== item.code,
      );

      const filteredIndividualForm = selectedIndividualForm.map(
        ind => {
          const { type, form, metrics } = ind;
          if (item.code === type) {
            if (item.value.selectedForm.id === form) {
              const newItem = {
                type,
                form,
                metrics: metrics.filter(
                  m =>
                    m.code !== item.value.selectedIndividualForm.code,
                ),
              };
              return newItem;
            } else {
              return ind;
            }
          } else {
            return ind;
          }
        },
      );
      // const formValues = [];
      // filteredArr.map(f => {
      //   if (f.value && f.value.selectedForm) {
      //     formValues.push(f.code);
      //   }
      // });
      // const filteredFormQuestions = selectedQuestions.filter(m =>
      //   formValues.includes(m.code),
      // );

      // const filteredFormValue = selectedFormValue.filter(v => {
      //   return filteredArr.map(f => {
      //     if (f.value && f.value.selectedQuestions) {
      //       if (f.value.selectedQuestions.code === v.code) {
      //         return true;
      //       }
      //       return false;
      //     }
      //   });
      // });

      return {
        data: {
          ...state.data,
          selectedMetrics: filteredArr,
        },
        formInfo: {
          ...state.formInfo,
          // selectedFormType: filteredFormType.includes(true)
          //   ? selectedFormType
          //   : {},
          // selectedForm: filteredForm.includes(true)
          //   ? selectedForm
          //   : {},
          selectedIndividualForm: filteredIndividualForm,
          // selectedQuestions: filteredFormQuestions,
          // selectedFormValue: filteredFormValue,
        },
        userList: filteredUserArr,
        submissions: filteredSubmissionArr,
        siteInfo: {
          ...state.siteInfo,
          selectedMetas: filteredSelectedMetas,
          selectedValue: filteredMetaArr,
          siteValues:
            filteredSelectedMetas.length > 0
              ? this.state.siteInfo.siteValues
              : [],
        },
      };
    });
  };

  handleChangeMeta = (e, meta, value) => {
    if (meta && Object.keys(meta).length > 0) {
      this.handleMetaCheck(e, meta);
    }
    // if (value && Object.keys(value).length > 0) {
    //   this.handleValueCheck(e, value);
    // }
  };

  handleMetaCheck = (e, meta) => {
    const {
      siteInfo: { selectedMetas },
    } = this.state;
    const { name, checked } = e.target;
    this.setState(
      state => {
        if (checked) {
          return {
            siteInfo: {
              ...state.siteInfo,
              selectedMetas: [...state.siteInfo.selectedMetas, meta],
            },
          };
        }
        if (!checked) {
          const filterMetas = selectedMetas.filter(
            type => type.code !== name,
          );
          return {
            siteInfo: {
              ...state.siteInfo,
              selectedMetas: filterMetas,
            },
          };
        }
      },
      () => {
        this.handleAddValue();
        // this.setSiteValue();
      },
    );
  };

  setSiteValue = () => {
    this.handleAddValue();
    const {
      siteInfo: { selectedMetas, siteValues },
      siteInfoArr,
    } = this.state;

    const arr = [];
    selectedMetas.map(each => {
      if (
        each.type === 'Number' ||
        each.type === 'FormSubCountQuestion'
      ) {
        arr.push('number');
      } else {
        arr.push('text');
      }
    });
    if (arr.length > 0) {
      this.setState(state => {
        if (arr.includes('text')) {
          const siteTextArr = this.handleTextValueTypes(
            'site',
            siteInfoArr,
            siteValues,
          );
          return {
            siteInfo: {
              ...state.siteInfo,
              siteValues: siteTextArr,
            },
          };
        } else {
          // this.handleAllValueTypes('site');
          const filteredValues =
            siteInfoArr.length > 0 && siteInfoArr;
          return {
            siteInfo: {
              ...state.siteInfo,
              siteValues: filteredValues,
            },
          };
        }
      });
    } else {
      this.setState({
        siteInfo: { ...this.state.siteInfo, siteValues: [] },
      });
    }
  };

  handleTextValueTypes = (type, toSearchArr, selectedArr) => {
    let filteredValues = [];

    if (type === 'site') {
      const someArr = selectedArr;
      if (toSearchArr.length > 0) {
        toSearchArr.map(info => {
          if (someArr.length > 0) {
            filteredValues = someArr.filter(some => {
              if (
                some.code === 'actual' ||
                some.code === 'most_common' ||
                some.code === 'all_values'
              ) {
                return true;
              } else {
                return false;
              }
            });
          } else {
            if (
              info.code === 'actual' ||
              info.code === 'most_common' ||
              info.code === 'all_values'
            ) {
              filteredValues.push(info);
            }
          }
        });
      }
    }

    return filteredValues;
    // });
  };

  handleValueCheck = (e, item) => {
    const { checked } = e.target;
    const {
      siteInfo: { selectedValue },
    } = this.state;
    this.setState(
      state => {
        if (checked) {
          return {
            siteInfo: {
              ...state.siteInfo,
              selectedValue: [...state.siteInfo.selectedValue, item],
            },
          };
        }
        if (!checked) {
          const newMetasArr = selectedValue.filter(
            s => s.code !== item.code,
          );
          return {
            siteInfo: {
              ...state.siteInfo,
              selectedValue: newMetasArr,
            },
          };
        }
      },
      () => {
        this.handleAddValue();
      },
    );
  };

  handleSelectChange = data => {
    this.setState(state => ({
      data: {
        ...state.data,
        selectedMetrics: data,
      },
    }));
  };

  addSubmissionCount = (
    selectedFormType,
    selectedForm,
    submissionCount,
  ) => {
    const {
      data: { selectedMetrics },
    } = this.state;
    const toshowArr = [];
    submissionCount.map(each => {
      const { type, form, metrics } = each;
      if (
        type === selectedFormType.code &&
        form === selectedForm.id
      ) {
        metrics.map(m => {
          toshowArr.push({
            ...selectedFormType,
            value: {
              selectedForm,
              selectedIndividualForm: {
                ...m,
              },
            },
          });
        });
      }
    });

    this.setState(state => {
      const filterMetrics = selectedMetrics.filter(m => {
        if (m.value && m.value.selectedIndividualForm) {
          if (m.code === selectedFormType.code) {
            if (m.value.selectedForm.id === selectedForm.id) {
              return false;
            }
            if (m.value.selectedForm.id !== selectedForm.id) {
              return true;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      });

      return {
        data: {
          ...state.data,
          selectedMetrics: [...filterMetrics, ...toshowArr],
        },
        formInfo: {
          ...state.formInfo,
          selectedIndividualForm: submissionCount,
        },
      };
    });
  };

  handleFormInfo = ({
    selectedFormType,
    selectedForm,
    selectedQuestions,
    selectedFormValue,
  }) => {
    const addArr = selectedFormValue.map(val => {
      const input = {
        ...selectedFormType,
        value: {
          selectedForm,
          selectedQuestion: {
            ...selectedQuestions,
            form: { ...val },
          },
        },
      };
      return input;
    });
    const {
      data: { selectedMetrics },
    } = this.state;

    this.setState(state => {
      const filterMetrics = selectedMetrics.filter(m => {
        if (m.value && m.value.selectedQuestion) {
          if (
            m.code === selectedFormType.code &&
            m.value.selectedForm.id === selectedForm.id
          ) {
            if (
              m.value.selectedQuestion.name === selectedQuestions.name
            ) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      });
      return {
        data: {
          ...state.data,
          selectedMetrics: [...filterMetrics, ...addArr],
        },
        formInfo: {
          ...state.formInfo,
          selectedQuestions,
          selectedFormValue,
        },
      };
    });
  };

  handleSubmitReport = () => {
    const { reportId, data, projectId } = this.state;
    const errors = this.onValidation();
    this.setState({
      errors,
    });
    if (errors && Object.keys(errors).length === 0) {
      const body = {
        type: data.selectedReportType,
        description: data.desc,
        title: data.reportName,
        attributes: JSON.stringify(data.selectedMetrics),
      };
      if (reportId) {
        this.requestUpdateForm(reportId, body);
      } else {
        Axios.post(`/v4/api/reporting/add-report/${projectId}/`, body)
          .then(res => {
            if (res.data) {
              const reportId = res.data.id;
              this.setState(
                () => ({
                  reportId,
                  applyFilter: true,
                }),
                () => {
                  successToast('Report', 'created');
                  this.props.history.push(
                    `/project-dashboard/${projectId}/report`,
                  );
                },
              );
            }
          })
          .catch(err => {
            const errors = err.response;
            errors && errorToast(errors && errors.data);
          });
      }
    }
  };

  onValidation = () => {
    const {
      data: { reportName, desc },
    } = this.state;
    const err = {};
    if (!reportName) err.reportName = 'required';
    if (!desc) err.desc = 'required';
    return err;
  };

  handleSubmitFilter = filter => {
    const { reportId, data } = this.state;
    const { regions, siteType } = filter;

    const modifyFilter = {
      regions: regions.filter(r => r.id !== 'all_regions'),
      site_types: siteType.filter(r => r.id !== 'all_sitetypes'),
    };
    this.setState(
      state => ({
        filter: {
          ...state.filter,
          filterBy: modifyFilter,
        },
      }),
      () => {
        const body = {
          type: data.selectedReportType,
          description: data.desc,
          title: data.reportName,
          attributes: JSON.stringify(data.selectedMetrics),
          filter: JSON.stringify(modifyFilter),
        };
        this.requestUpdateForm(reportId, body);
      },
    );
  };

  requestUpdateForm = (reportId, body) => {
    Axios.put(`/v4/api/reporting/report/${reportId}/`, body)
      .then(res => {
        if (res.data) {
          successToast('Report', 'updated');
          if (Object.keys(res.data.filter).length > 0) {
            this.setState({
              showActions: true,
            });
          }
        }
      })
      .catch(err => {
        const errors = err.response;
        errorToast(errors);
      });
  };

  handleToggleDelete = () => {
    this.setState(({ isDelete }) => ({ isDelete: !isDelete }));
  };

  handleCancel = () => {
    this.setState({ isDelete: false });
  };

  handleConfirmDelete = () => {
    const { projectId } = this.state;
    this.props.history.push(`/project-dashboard/${projectId}/report`);
  };

  onSyncClick = () => {
    this.props.applyActionToReport(this.state.reportId, 'sync');
  };

  onExportCSV = () => {
    this.props.applyActionToReport(this.state.reportId, 'excel');
  };

  render() {
    const {
      state: {
        data: {
          reportName,
          desc,
          selectedReportType,
          selectedMetrics,
        },
        formInfo: {
          selectedFormType,
          selectedForm,
          selectedIndividualForm,
          selectedQuestions,
          formValue,
          selectedFormValue,
        },
        siteInfo: { selectedMetas, siteValues },
        reportType,
        metricArr,
        formInfoArr,
        toggleSelectClass,
        submissionType,
        submissions,
        usersArr,
        userList,
        metaAttributes,
        formTypeArr,
        individualFormArr,
        collapseClass,
        filterArr,
        filter: { filterBySiteType, filterByRegions, filterBy },
        applyFilter,
        isDelete,
        showActions,
        errors,
      },
      props: {
        reportReducer: {
          reportLoader,
          forms,
          formTypes,
          formQuestions,
          siteTypes,
          regions,
        },
        match: {
          params: { id: projectId, reportId },
        },
      },
    } = this;
    // console.log('class', this.state.siteInfo.selectedValue);
    const isEdit = reportId ? true : false;
    const actions = [
      // {
      //   id: 0,
      //   title: 'sync',
      //   icon: 'sync',
      //   menu: [{ key: 1, text: 'Sync Now', link: this.onSyncClick }],
      // },
      {
        id: 1,
        title: 'export',
        icon: 'save_alt',
        menu: [
          { key: 1, text: 'Microsoft Excel', link: this.onExportCSV },
        ],
      },
    ];

    return (
      <>
        <nav aria-label="breadcrumb" role="navigation">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href={`/fieldsight/application/#/project-dashboard/${projectId}/report`}
              >
                Reports
              </a>
            </li>
            <li className="breadcrumb-item">
              {isEdit ? 'Edit Report' : 'Create Report'}
            </li>
          </ol>
        </nav>
        <div className="reports mrb-30">
          <div className="card">
            <div className="card-body">
              <div className="report-generator">
                <div className="reports-header mt-4">
                  {isEdit && <h3 className="mb-3">Edit report</h3>}
                  {!isEdit && <h3 className="mb-3">New report</h3>}
                  <button
                    type="button"
                    className="common-button is-bg is-icon"
                    onClick={() => {
                      this.handleToggleDelete();
                    }}
                  >
                    <i className="material-icons">close</i>
                    <span>Cancel</span>
                  </button>
                </div>
                <div className="filter-all-header">
                  <form
                    className="floating-form "
                    onSubmit={e => {
                      e.preventDefault();
                    }}
                  >
                    <div>
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="text"
                        required
                        label="Report Name"
                        name="reportName"
                        value={reportName}
                        changeHandler={this.handleChange}
                      />
                      {errors && errors.reportName && (
                        <small style={{ color: 'red' }}>
                          {`*${errors.reportName}`}
                        </small>
                      )}
                    </div>
                    <div>
                      <InputElement
                        formType="editForm"
                        tag="input"
                        type="text"
                        required
                        label="Description"
                        name="desc"
                        value={desc}
                        changeHandler={this.handleChange}
                      />
                      {errors && errors.desc && (
                        <small style={{ color: 'red' }}>
                          {`*${errors.desc}`}
                        </small>
                      )}
                    </div>
                    <div className="report-type">
                      <div className="row">
                        <div
                          className="col-lg-3 col-md-4"
                          // ref={node => (this.reportRef = node)}
                        >
                          <div className="form-group inline-form-group">
                            <label className="">Report type</label>
                            {!reportLoader && (
                              <CustomSelect
                                name={reportType.filter(
                                  each =>
                                    each.id === selectedReportType,
                                )}
                                options={reportType}
                                value={selectedReportType}
                                handleSelect={
                                  this.handleReportTypeChange
                                }
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-lg-9 col-md-8">
                          <button
                            className="common-button is-disable is-icon pull-right is-bg"
                            type="button"
                            onClick={() => {
                              this.handleToggleCollapse();
                            }}
                          >
                            <i className="material-icons">
                              filter_list
                            </i>
                            <span>collapse all</span>
                            <i className="material-icons arrow-icon">
                              {collapseClass
                                ? 'expand_more'
                                : 'expand_less'}
                            </i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                {collapseClass && (
                  <>
                    <div className="report-accordion">
                      <div className="row ">
                        <Metrics
                          projectId={projectId}
                          handleToggleClass={this.handleToggleClass}
                          toggleSelectClass={toggleSelectClass}
                          data={metricArr}
                          users={usersArr}
                          userList={userList}
                          siteValues={siteValues}
                          metaAttributes={metaAttributes}
                          selectedMetas={selectedMetas}
                          handleSelectMeta={this.handleChangeMeta}
                          submissionType={submissionType}
                          submissions={submissions}
                          handleSubmissionType={
                            this.handleSubmissionType
                          }
                          handleCheckSubmissionType={
                            this.handleCheckSubmissionType
                          }
                          handleCheckUser={this.handleChecKUser}
                          selectedMetrics={selectedMetrics}
                          formInfoArr={formInfoArr}
                          formTypes={formTypes}
                          selectedFormType={selectedFormType}
                          formTypeArr={formTypeArr}
                          selectedForm={selectedForm}
                          formQuestions={formQuestions}
                          forms={forms}
                          individualFormArr={individualFormArr}
                          selectedIndividualForm={
                            selectedIndividualForm
                          }
                          selectedQuestions={selectedQuestions}
                          formValue={formValue}
                          selectedFormValue={selectedFormValue}
                          addSubmissionCount={this.addSubmissionCount}
                          handleFormInfo={this.handleFormInfo}
                        />
                        <SelectedColumn
                          selected={selectedMetrics}
                          handleSelectChange={this.handleSelectChange}
                          handleCheckSubmissionType={
                            this.handleChangeArray
                          }
                        />
                        <div className="col-lg-12">
                          <div className="buttons flex-end">
                            <button
                              type="button"
                              className="common-button is-border"
                              onClick={() => {
                                this.handleToggleDelete();
                              }}
                            >
                              Discard Changes
                            </button>
                            <button
                              type="button"
                              className="common-button is-bg"
                              onClick={() => {
                                this.handleSubmitReport();
                              }}
                            >
                              Save Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {filterArr.length > 0 && (
                      <DataFilter
                        toggleSelectClass={toggleSelectClass}
                        handleToggleClass={this.handleToggleClass}
                        filterArr={filterArr}
                        filterBySiteType={filterBySiteType}
                        filterByRegions={filterByRegions}
                        applyFilter={applyFilter}
                        handleSubmitFilter={this.handleSubmitFilter}
                        filteredData={filterBy}
                        siteTypes={siteTypes}
                        regions={regions}
                      />
                    )}
                  </>
                )}
                {showActions && (
                  <div className="report-table  mt-3">
                    {actions.map(action => (
                      <Dropdown key={action.title}>
                        <Dropdown.Toggle
                          drop="right"
                          variant=""
                          id="dropdown-Data"
                          className="common-button data-toggle is-border is-icon"
                        >
                          {action.title}
                          <i className="material-icons">
                            {action.icon}
                          </i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                          {action.menu.map(item => (
                            <Dropdown.Item
                              onClick={() => {
                                item.link();
                              }}
                              key={item.key}
                              // target="_blank"
                            >
                              {item.text}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    ))}
                  </div>
                )}
              </div>
              {isDelete && (
                <DeleteModal
                  onConfirm={this.handleConfirmDelete}
                  onCancel={this.handleCancel}
                  onToggle={this.handleToggleDelete}
                  message="Are you sure you want to cancel? All entered data will be lost"
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ reportReducer }) => ({
  reportReducer,
});

export default connect(mapStateToProps, {
  getMetricsData,
  getForms,
  getFormQuestions,
  applyActionToReport,
  getReportData,
})(AddNewReport);
