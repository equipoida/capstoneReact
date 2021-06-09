import React, { Component } from 'react';
import BoardService from '../service/BoardService';
import heart from '../assets/images/heart.png';
class SearchTagComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {

            boards: [],
            tag: props.match.params.tag,
            tags: "",
            hots: []
        }
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.getHotBoard();
        this.getPopularTag();
    }
    componentDidMount() {
        BoardService.getSearchTag(this.state.tag).then((res) => {
            this.setState({

                boards: res.data

            });
        })
    }
    AllHotBoard() {
        this.props.history.push(`/Allhotboard`);
    }
    handleSearchChange = (event) => {
        this.setState({ tag: event.target.value });
    }
    searchKeyWord(search) {

        this.props.history.push(`/search-board/${search}`);

    }
    clearbtn = (event) => {
        this.setState({ search: '' });

    }

    returnDate(board_date) {
        const dateString = board_date + ""
        let y = dateString.split("T"); //날짜 , 시간.00:00:00
        let yymmdd = y[0];
        let t = y[1] + "";
        let tt = t.split(".");
        let hhmmss = tt[0];
        return (
            <div style={{ display: 'inline' }}>
                {yymmdd}, {hhmmss}
            </div>
        )
    }
    readBoard(num) {
        this.props.history.push(`/read-board/${num}`);
    }
    getHotBoard() {
        BoardService.getHotBoard().then((res) => {
            this.setState({
                hots: res.data
            });

        });
    }
    getPopularTag() {
        BoardService.getPopularTag().then((res) => {
            console.log("this.is" + res.data)
            this.setState({
                tags: res.data

            });
        });
        this.returnTag()
    }

    searchtag(tag) {
        window.location.replace("/SearchTagComponent/" + tag)


    }
    returnTag() {
        const tag = this.state.tags + ""
        console.log("string" + tag)
        let str01 = tag.split(",");

        return (
            <div>
                <a className="homecategory" onClick={() => this.searchtag(str01[0])} > #{str01[0]} </a><br />
                <a className="homecategory" onClick={() => this.searchtag(str01[2])} >#{str01[2]}</a><br />
                <a className="homecategory" onClick={() => this.searchtag(str01[4])} > #{str01[4]}</a><br />
                <a className="homecategory" onClick={() => this.searchtag(str01[6])} > #{str01[6]}</a><br />
                <a className="homecategory" onClick={() => this.searchtag(str01[8])} > #{str01[8]}</a><br />
            </div>
        )

    }
    render() {
        return (

            <div class="container-fluid">

                <h2 style={{ textAlign: 'center' }}>#{this.state.tag}</h2><br />
                <div class="row">
                    <div class="col-lg-9">
                        <hr style={{ width: "100%", border: "1px solid #bad1e6" }} />

                        {
                            this.state.boards.map(
                                board =>
                                    <div >

                                        <div key={board.board_no} style={{ borderRadius: "10px" }}>

                                            <div><a onClick={() => this.readBoard(board.board_no)}><h5>{board.title}</h5></a><br />
                                            </div>
                                            <div style={{ display: "inline-block", width: "800px", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                                {board.question}
                                            </div>
                                            <div style={{ left: "5%", display: "inline" }}>
                                                {this.returnDate(board.board_date)}
                                                            &nbsp;  &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp;
                                                            {board.id}
                                            </div>
                                            <div style={{ display: "inline", position: "absolute", right: "5%" }}>
                                                🤍{board.board_like} 🗨️{board.commentcount}

                                            </div>
                                            <hr style={{ width: "100%", border: "1px solid #bad1e6" }} />
                                        </div>
                                    </div>
                            )
                        }



                    </div>{/* 글작성, 게시물 div*/}
                    <div class="col-lg-3">
                        <div >{/* 검색, 태그 div*/}
                            <table>
                                <tr>

                                    <td>
                                        <input type="text" placeholder="검색하기"
                                            name="search" value={this.state.search}
                                            className="form-control" onChange={this.handleSearchChange} />
                                    </td>
                                    <td><button className="btn btn-outline-secondary btn-search" onClick={() => this.searchKeyWord(this.state.search)}>Search</button></td>


                                </tr>
                            </table>

                            <div >
                                <div className="single-department-two mt-30">
                                    <div className="department-content text-center">
                                        <h4 className="department-title">
                                            #인기태그
                                            </h4>
                                        <p className="text">
                                            {this.returnTag()}
                                        </p>

                                    </div>
                                    <div className="department-content text-center">
                                    <h4 className="department-title" onClick={()=>this.AllHotBoard()} >
                                            HOT 게시물
                                            </h4>
                                        <table className="table-board">
                                            <tbody>
                                                {this.state.hots.map(
                                                    hot =>
                                                        <tr className="tr">
                                                            <a className="hot" onClick={() => this.readBoard(hot.board_no)}>{hot.title}  <img src={heart} style={{ width: "20px", height: "20px", marginBottom: "3px" }} alt='heart' ></img>{hot.board_like} 🗨️ {hot.commentcount}</a>
                                                        </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>{/* 검색, 태그 div*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchTagComponent;