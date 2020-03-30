import React, { Component } from "react";
import {} from 'react-router-dom'
import {Pagination} from 'semantic-ui-react'
import Loader from 'react-loader-spinner'
import 'semantic-ui-css/semantic.min.css'
import {baseurl} from './config'
import axios from 'axios'
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      pageSize: 100,
      data: [],
      loading: false,
    };
    this.handlePageChange = this.handlePageChange.bind(this)
    this.onPageSizeChange =this.onPageSizeChange.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
  }
  handlePageChange(e,{activePage}){
    console.log(activePage)
    this.setState({
      activePage: activePage,
      loading: true
    })     
    window.location.replace(`/items/${this.state.pageSize}/${activePage}`) 
  }
  onPageSizeChange(event){   
    console.log(event.target.va)
    this.setState({
      pageSize: event.target.value
  })

  }
  onRefresh(){
    const {pageSize} = this.state
    if(pageSize > 1 && pageSize !== this.props.match.params.pageSize){
      window.location.replace(`/items/${pageSize}/1`)       
    }
    
}
  componentDidMount(){
    this.setState({
      loading: true
    })
    axios({
      method:'get',
      url: `${baseurl}/100/1`
    }).then((res)=>{
      console.log(res.data)
      this.setState({data: res.data.data,loading:false})
    }).catch(error=>{
      console.log(error)
      this.props.history.push('/error')
    })
  }
  render() {
    const { data,pageSize,activePage,loading} = this.state;
    const numberOfPages = Math.ceil(1000000/pageSize)
    return (
      <div className="container padding-top-2">
        <div className="d-flex flex-row align-items-center mb-1 font-2 col-sm-5 p-0">
          <span className="col-sm-3 p-0 text-left font-2">Set page size:</span>
          <input
            type="number"
            min="1"
            max="1000000"
            className="col-sm-3 form-control mr-3"
            value={pageSize}
            onChange = {this.onPageSizeChange}
          />
          <button className="btn btn-secondary  font-2 "  onClick={this.onRefresh}>Refresh</button>
        </div>
        <div className="col-sm-9 loader " style={{display:`${loading?'flex':'none'}`}}>         
            <Loader
              type="TailSpin"
              height={50}
              width={50}
              color={"#6c757d"}
            />
        </div>
       
        <div className="table-items " style={{display:`${loading?'none':'block'}`}}>
        <table className="table table-bordered col-sm-9 mt-2 mb-3">
          <thead className="text-normal text-capitalize bg-secondary text-white">
            <tr>
            <th>id</th>
            <th>absolute index</th>
            <th>name</th>
            </tr>
          
          </thead>
          <tbody className="tbody">
            {data.map((item, key) => (
              <tr key={key}>
                <td>{item.id}</td>
                <td>{item.absoluteIndex}</td>
                <td>{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="d-flex  mt-2 flex-row align-items-center justify-content-center col-sm-9 text-center p-0" >
           <Pagination totalPages={numberOfPages} boundaryRange={3} activePage={activePage} onPageChange={this.handlePageChange} />
        </div>
      </div>
    );
  }
}
