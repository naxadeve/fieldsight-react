import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import LeftSidebar from "../leftSidebar/LeftSidebar";
import EditProject from "../editProject/EditProject";
import SiteType from "../siteType/SiteType";
import SiteInformation from "../siteInfo/SiteInformation";
import SiteManage from "../SiteManage";
import ManageRegion from "../manageRegion/ManageRegion";
import SubRegion from "../manageRegion/SubRegion";
import TermsAndLabels from "../termsAndLabels/TermAndLabel";
import MapLayer from "../mapLayer/MapLayer";

export default class Settings extends Component {
  render() {
    return (
      <div id="fieldsight-new" className="fieldsight-new">
        <div id="main-container">
          <div className="container-fluid">
            <main id="main-content">
              <nav aria-label="breadcrumb" role="navigation">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/fieldsight/organization/">Teams</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/fieldsight/organization-dashboard/13/">
                      Build Change
                    </a>
                  </li>

                  <li className="breadcrumb-item active" aria-current="page">
                    DFID 31 District Retrofitting
                  </li>
                </ol>
              </nav>
              <div className="row">
                <div className="col-xl-3 col-lg-4">
                  <div className="left-sidebar new-sidebar sticky-top">
                    <div className="card">
                      <div className="card-header main-card-header">
                        <h5>Meta Attributes</h5>
                      </div>
                      <div className="card-body">
                        <LeftSidebar />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-9 col-lg-8">
                  <div className="right-content">
                    <div className="tab-content">
                      <Switch>
                        <Route
                          exact
                          path="/project-settings"
                          component={EditProject}
                        />
                        <Route path="/site-type" component={SiteType} />
                        <Route
                          path="/site-information"
                          component={SiteInformation}
                        />
                        <Route
                          path="/manage-region/:subRegionId/sub-region"
                          component={SubRegion}
                        />
                        <Route path="/manage-region" component={ManageRegion} />

                        <Route path="/manage-site" component={SiteManage} />
                        <Route path="/map-layer" component={MapLayer} />
                        <Route
                          path="/term-and-label"
                          component={TermsAndLabels}
                        />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}