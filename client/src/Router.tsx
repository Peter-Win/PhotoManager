import * as React from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {InvalidPage} from "./pages/invalid/InvalidPage";
import {ViewPage} from "./pages/view/ViewPage";

export const MainRouter: React.FC = () => (
    <Router>
        <Switch>
            <Route path="/edit/:id">
                <InvalidPage title="Edit" />
            </Route>
            <Route path="/view/:id">
                <ViewPage />
            </Route>
            <Route exact path="/">
                <Redirect to="/view/0" />
            </Route>
            <Route path="*">
                <InvalidPage title="Invalid page" />
            </Route>
        </Switch>
    </Router>
);