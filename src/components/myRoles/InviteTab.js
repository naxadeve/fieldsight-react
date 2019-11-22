import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

class InviteTab extends Component {
  render() {
    return (
      <>
        <span
          className="popup-close"
          onClick={e => this.props.invitationOpen(e, 'role')}
        >
          <i className="la la-close" />
        </span>
        <div className="card">
          <div className="card-header main-card-header sub-card-header">
            <h5>
              <FormattedMessage
                id="app.invitation"
                defaultMessage="Invitation"
              />
            </h5>
            <div className="dash-btn ">
              <a
                onClick={e => this.props.acceptAll()}
                className="fieldsight-btn left-icon"
              >
                <i className="la la-check" />
                <FormattedMessage
                  id="app.acceptAll"
                  defaultMessage="Accept all"
                />
              </a>
            </div>
          </div>
          <div className="card-body">
            <div className="invitation-title">
              <span>
                <FormattedMessage
                  id="app.invitationTitle"
                  defaultMessage=" You have been invited to join FieldSight. You may Accept or
                            Decline each invitations or Accept all the invitations as per
                            required."
                />
              </span>
            </div>
            <div className="normal-list">
              <ul>
                {this.props.invitation.map((item, i) => (
                  <li key={item.id}>
                    <p>
                      <a href="javascript:void(0);">{item.by_user}</a>
                      <FormattedMessage
                        id="app.acceptAll"
                        defaultMessage=" has
                            invited you to join FieldSight as"
                      />{' '}
                      <span>{item.group}</span> .
                    </p>
                    <div className="invite-btn">
                      <a
                        href="javascript:void(0);"
                        className="accept-btn"
                        onClick={e =>
                          this.props.acceptHandler(
                            item.id,
                            item.current_user,
                          )
                        }
                      >
                        <i className="la la-check" />
                        <FormattedMessage
                          id="app.accept"
                          defaultMessage="Accept"
                        />
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="reject-btn"
                        onClick={e =>
                          this.props.rejectHandler(item.id)
                        }
                      >
                        <i className="la la-close" />

                        <FormattedMessage
                          id="app.reject"
                          defaultMessage="Reject"
                        />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default InviteTab;
