import React, { Component } from "react";
import axios from "axios";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { DotLoader } from "./Loader";
import { successToast, errorToast } from "./toastHandler";

const url = "fv3/api/form/";

class ShareModal extends Component {
  state = {
    userList: [],
    dLoader: true,
    shareState: false
  };

  componentDidMount() {
    const { modalTypes } = this.props;

    axios
      .get(`${url}${modalTypes}/`)

      .then(res => {
        
        const modifiedUser = res.data.map(user => ({
          ...user,
          checkbox: false
        }));

        this.setState({
          userList: modifiedUser
        });

        if (res.status==200) {
          this.setState({
            dLoader: false,
            shareState: true
          });
        }
      })
      .catch(err => console.log("err", err));
  }

  checkboxHandler = (e, checkboxId) => {
    const newUserList = [...this.state.userList];
    const selectedUser = newUserList.find(user => user.id === +checkboxId);

    selectedUser.checkbox = !selectedUser.checkbox;
    this.setState({
      userList: newUserList
    });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log("entered")
    const checkedList = this.state.userList
      .map(user => (user.checkbox == true ? +user.id : null))
      .filter(Boolean);
      console.log(checkedList)
    const id = this.props.modalDatas;
    const url = this.props.shareUrls;
    console.log("id_string",id)
    console.log(url)
    
    axios
      .post(url, { id_string: id, share_id: checkedList })
      .then(res => {
        
        successToast("Form", "shared");
      })

      .catch(
        
        err => console.log("err", err)
      
      );
  };

  render() {
    const type = this.props.modalTypes;

    return (
      <div className="thumb-list userlist">
        {this.state.userList.length === 0 && !this.state.dLoader && (
          <div className="card-header main-card-header sub-card-header bg-header">
            <h5>No Data Available</h5>
          </div>
        )}
        {this.state.shareState && (
          <form onSubmit={this.onSubmit}>
            <ul style={{ position: "relative", height: "450px" }}>
              <PerfectScrollbar>
                {this.state.userList.map((user, i) => (
                  <li key={user.id}>
                    <figure>
                      <img
                        src={
                          type === "users" ? user.profile_picture : user.logo
                        }
                        alt="image"
                      />
                    </figure>
                    <div className="content">
                      <h6>{type === "users" ? user.first_name : user.name} </h6>
                      {type == "users" ? <span>{user.email}</span> : null}
                    </div>
                    <div className="form-group checkbox-btn">
                      <div className="custom-checkbox">
                        <div className="checkbox ">
                          <label>
                            <input
                              type="checkbox"
                              onChange={e => this.checkboxHandler(e, user.id)}
                              checked={user.checkbox}
                            />
                            <i className="helper" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </PerfectScrollbar>
            </ul>
            <div className="form-group mrt-30 pull-right">
              <button type="submit" className="fieldsight-btn">
                Share
              </button>
            </div>
          </form>
        )}
        {this.state.dLoader && <DotLoader />}
      </div>
    );
  }
}

export default ShareModal;
