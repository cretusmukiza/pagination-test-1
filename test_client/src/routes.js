import React from 'react'
import {Switch,Route} from 'react-router-dom'
import Home from './home'
import ErrorPage from './error_page'
import Page from './page'
const Routes = ()=>{
    return(
        <Switch>
            <Route exact path="/"  component={Home}/>
            <Route path="/error"  component={ErrorPage}/>
            <Route path={`/items/:pageSize/:activePage`} component={Page} />
            <Route  exact path="*" component ={ErrorPage} />
            

        </Switch>
    )
}
export default Routes