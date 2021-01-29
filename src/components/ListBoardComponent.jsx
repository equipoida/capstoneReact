import React, { Component } from 'react';
import BoardService from '../service/BoardService';


class ListBoardComponent extends Component {
    constructor(props){
        super(props)
        this.state={ 
            p_num:1,
            category:props.match.params.category,
            paging:{},
            boards:[]
            
        }
        this.createBoard = this.createBoard.bind(this);
    }

    componentDidMount(){
        BoardService.getBoards(this.state.category,this.state.p_num).then((res)=>{
            this.setState({
                p_num:res.data.pagingData.currentPageNum,
                category:this.state.category,
                paging:res.data.pagingData,
                boards:res.data.list
                
            });
        })
    }

    createBoard(){
        this.props.history.push('/create-board/_create');
    }
    readBoard(num) {
        this.props.history.push(`/read-board/${num}`);
    }

    listBoard(category,p_num){
        console.log("pageNum : "+ p_num);
        BoardService.getBoards(category,p_num).then((res)=>{
            console.log(res.data);
            this.setState({
                p_num:res.data.pagingData.currentPageNum,
                category:this.state.category,
                paging:res.data.pagingData,
                boards:res.data.list});
        });
        //this.props.history.push(`?p_num=${p_num}`);
    }

    returnDate(board_date) {
        const dateString=board_date+""
        let y= dateString.split("T"); //날짜 , 시간.00:00:00
        let yymmdd= y[0];
        let t=y[1]+"";
        let tt=t.split(".");
        let hhmmss=tt[0];
        return (
            <div className = "row">
                <label> [ {yymmdd}, {hhmmss} ] </label>
            </div>
        )
    }

    viewPaging(){
        const pageNums =[];
        for(let i = this.state.paging.pageNumStart;i <= this.state.paging.pageNumEnd; i++ ){
            pageNums.push(i);
        }
        return(pageNums.map((page)=> 
        <li className="page-item" key={page.toString()}>
            <a className="page-link" onClick={()=> this.listBoard(this.state.category,page)}>{page}</a>
        </li>
        ));
    }

    isPagingPrev(){
        if(this.state.paging.prev){
            return (
                <li className="page-item">
                    <a className="page-link" onClick={()=>this.listBoard((this.state.category,this.state.paging.currentPageNum-1))} tabIndex="-1">Previous</a>
                </li>
            );
        }
    }

    isPagingNext(){
        if(this.state.paging.next){
            return(
                <li className="page-item">
                    <a className="page-link" onClick={()=>this.listBoard((this.state.category,this.state.paging.currentPageNum+1))}tabIndex="-1">Next</a>
                </li>
            );
        }
    }
    isMoveToFirstPage() {
        if (this.state.p_num !== 0) {//1
            return (
                <li className="page-item">
                    <a className="page-link" onClick = {() => this.listBoard(this.state.category,1)} >Move to First Page</a>
                </li>
            );
        }
    }
    isMoveToLastPage() {
        if (this.state.p_num !== this.state.paging.pageNumCountTotal) {
            return (
                <li className="page-item">
                    <a className="page-link" onClick = {() => this.listBoard( (this.state.category,this.state.paging.pageNumCountTotal) )} tabIndex="-1">LastPage</a>
                </li>
            );
        }
    }

    render() {
        return (
            <div>
                <h2 className="text-center">{this.state.category}  
                <a onClick={()=> this.props.hisory.push(`/category-map/${this.state.category}`)}>    지도</a>
               </h2>

                <div className="row">
                    <button className="btn btn-primary" onClick={this.createBoard}>글 작성</button> 
                </div> 

                <div className="row">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                               
                                <th>타이틀</th>
                                <th>작성날짜</th>
                                <th>좋아요</th>
                                <th>작성자</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {
                                this.state.boards.map(
                                    board=>
                                    <tr key ={board.board_no}>
                                        <td> <a onClick ={()=> this.readBoard(board.board_no)}>{board.title}</a></td>
                                        <td>{this.returnDate(board.board_date)}</td> 
                                        <td>{board.board_like}</td>
                                        <td>{board.id}</td>
                            
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <div className="row">
                <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-center">
                            
                            {
                                this.isMoveToFirstPage()
                            }
                            {
                                this.isPagingPrev()
                            }
                            {
                                this.viewPaging()
                            }
                            {
                                this.isPagingNext()
                            }
                            {
                                this.isMoveToLastPage()
                            }
                        </ul>
                    </nav>

                </div>
            </div>
        );
    }
}

export default ListBoardComponent;