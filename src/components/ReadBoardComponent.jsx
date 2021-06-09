import React, { Component } from 'react';
import BoardService from '../service/BoardService';
import heart from '../assets/images/heart.png';
class ReadBoardComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            num: props.match.params.num,
            board: {},
            comments: [],
            answer: null,
            comment_date: Date.now(),
            search: props.match.params.search,
            Member: {}, //1
            hots: [],
            tags: [],
            similar: [],
            imagesrc: '',
            id: '',
            commentliketo: null

        }

        this.goToUpdate = this.goToUpdate.bind(this);
        this.createComment = this.createComment.bind(this);
        this.likeboard = this.likeboard.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.returnTag();
    }
    changeanswer = (event) => {
        this.setState({ answer: event.target.value });
    }
    componentDidMount() {
        BoardService.getUserName().then((res) => {
            console.log("id is " + res.data)
            this.setState({
                id: res.data

            });
        });

        BoardService.getOneBoard(this.state.num).then(res => {
            console.log("Board " + res.data)
            this.setState({
                board: res.data,
                imagesrc: res.data.filepath
            });
            BoardService.getSimilarTag(this.state.board.tag1, this.state.board.tag2, this.state.board.tag3, this.state.board.tag4, this.state.board.tag5).then((res) => {
                console.log("Similar Tag " + res.data)
                const no = this.state.num
                this.setState({
                    similar: res.data.filter(function (element) {
                        return element.board_no != no
                    })
                });

            });

        });
        BoardService.getOneComment(this.state.num).then(res => {
            this.setState({
                comments: res.data
            });
        });
        BoardService.getPopularTag().then((res) => {
            console.log("this is popularTag" + res.data)
            this.setState({
                tags: res.data

            });
        });

        BoardService.getHotBoard().then((res) => {
            console.log("Hot" + res.data)
            this.setState({
                hots: res.data
            });

        });
    }
    createComment = (event) => {
        event.preventDefault();
        let comment = {
            answer: this.state.answer,
            comment_id: this.state.id,
            board_no: this.state.board.board_no,
            board_id: this.state.board.id,
            comment_date: this.state.comment_date,
            comment_like: 0
        };
        if (comment.answer != null) {
            BoardService.createComment(comment).then(res => {
                window.location.replace('/read-board/' + this.state.num);
            });
        }
        else {
            window.alert("댓글을 작성해주세요")
        }
    }

    returnBoardType(category) {
        let type = null;
        return (
            <div className="row">
                <label>Board type : </label> {type}
            </div>
        )
    }
    returnDate(board_date) {
        const dateString = board_date + ""
        let y = dateString.split("T"); //날짜 , 시간.00:00:00
        let yymmdd = y[0];
        let t = y[1] + "";
        let tt = t.split(".");
        let hhmmss = tt[0];
        return (
            <div className="row">
                {yymmdd}, {hhmmss}
            </div>
        )
    }

    goToList() {
        this.props.history.push(`/category-board/${this.state.board.category}`);
    }
    goToUpdate = (event) => {
        event.preventDefault();
        this.props.history.push(`/create-board/${this.state.num}`);
    }
    likeboard = (event) => {
        event.preventDefault();
        this.setState({ board_like: event.target.value });

        let board = {
            title: this.state.board.title,
            question: this.state.board.question,
            board_date: this.state.board.board_date,
            board_like: this.state.board.board_like + 1,
            category: this.state.board.category,
            id: this.state.board.id,
            filepath: this.state.board.filepath,
            tag1:this.state.board.tag1,
            tag2:this.state.board.tag2,
            tag3:this.state.board.tag3,
            tag4:this.state.board.tag4,
            tag5:this.state.board.tag5,
        };

        let boardliketo = {

            like_no: this.state.board.board_like + 1,
            board_no: this.state.board.board_no,
            username: this.state.id,
            like_check: true

        };
        BoardService.getboardliketoByNum(this.state.board.board_no, this.state.id).then(res => {
            console.log("what is that " + JSON.stringify(res.data));

            if (res.data === 0) {
                BoardService.createboardlikt(boardliketo).then(res => {
                    console.log("delete result => " + JSON.stringify(res));
                    if (res.status === 200) {
                        BoardService.updateBoard(this.state.num, board).then(res => {
                            if (res.status === 200) {
                                window.location.replace('/read-board/' + this.state.num);
                            } else {
                                alert("실패했습니다.");
                            }
                        });



                    } else {
                        window.alert("수정이 실패했습니다.");
                    }
                });

            }
            else {
                window.alert("이미 좋아요를 완료했습니다");
            }
        });
    }
    deleteView = async function () {
        if (window.confirm("정말로 글을 삭제하시겠습니까?\n삭제된 글은 복구 할 수 없습니다.")) {
            BoardService.deleteBoard(this.state.num).then(res => {
                console.log("delete result => " + JSON.stringify(res));
                if (res.status === 200) {
                    this.props.history.push(`/category-board/${this.state.board.category}`);
                } else {
                    alert("글 삭제가 실패했습니다.");
                }
            });

        }
    }
    deleteComment = async function (comment_no) {
        window.alert("댓글을 삭제하시겠습니까?\n삭제된 댓글은 복수할 수 없습니다.")
        BoardService.deleteComment(comment_no).then(res => {
            console.log("delete result => " + JSON.stringify(res));
            if (res.status === 200) {
                window.location.replace('/read-board/' + this.state.num);
            } else {
                alert("댓글 삭제가 실패했습니다.");
            }
        });


    }
    readBoard(num) {
        window.location.replace(`/read-board/${num}`)
    }
    handleSearchChange = (event) => {
        this.setState({ search: event.target.value });
    }
    searchKeyWord(search) {
        this.props.history.push(`/search-board/${search}`);

    }
    searchtag(tag) {
        this.props.history.push(`/SearchTagComponent/${tag}`);
    }
    returnTag = () => {
        const tag = this.state.tags + ""
        console.log("this is hot" + tag)
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



    getTitle(filepath) {
        console.log(filepath)
        if (filepath === null) {
            return (<h3 className="text-center"></h3>)
        } else if (filepath === undefined) {
            return (<h3 className="text-center"></h3>)
        }
        else {
            return (<div className="row">
                <img className="image" src={require('../../src/image/' + filepath).default} />

            </div>)

        }
    }
    getcommentboard(comments) {
        if (this.state.board.category != '홍보게시판' && this.state.board.category != '공지사항') {
            return (
                <div>
                    <div className="card col-md-10 offset-md-1" >

                        <div className="row" >

                            <textarea className="comment-textarea"
                                type="text"
                                placeholder="댓글" name="answer"
                                value={this.state.answer}
                                onChange={this.changeanswer}
                            />
                            <button className="main-btn" onClick={this.createComment} >댓글</button>


                        </div>
                    </div>
                    {
                        comments.map(
                            comment =>
                                <div key={comment} className="card col-md-10 offset-md-1">
                                    <div className="row"  >
                                        &nbsp;&nbsp;&nbsp;&nbsp; <h5>{comment.comment_id}</h5> &nbsp;  &nbsp; &nbsp; {this.returnDate(comment.comment_date)}
                                        <br />
                                        <div style={{ position: "absolute", top: "0px", right: "5%" }}>
                                            <a onClick={() => this.updateComment(comment.comment_date, comment.comment_id, comment.answer, comment.comment_like, comment.comment_no, this.state.id,)}><img src={heart} style={{ width: "20px", height: "20px", marginBottom: "3px" }} alt='heart' ></img>{comment.comment_like}</a>

                                        &nbsp;&nbsp;&nbsp;
                                        {this.checkidcomment(comment.comment_id, comment.comment_no)}
                                        </div>
                                    </div>
                                    {comment.answer}

                                    {comment.comement_id}<br />
                                </div>
                        )
                    }
                </div>
            )
        }
    }

    checkidcomment(id, comment_no) {
        console.log("id is" + id + comment_no)
        if (this.state.id == id) {
            return (
                <a onClick={() => this.deleteComment(comment_no)}>삭제</a>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    }

    updateComment = async function (comment_date, comment_id, answer, comment_like, comment_no, id) {
        console.log(comment_date, comment_id, answer, comment_like, comment_no, id)
        let commentlike = ''
        console.log("comment like is " + commentlike + "is that")

        let comment = {
            comment_no: comment_no,
            answer: answer,
            comment_id: comment_id,
            board_no: this.state.board.board_no,
            board_id: this.state.board.id,
            comment_date: comment_date,
            comment_like: comment_like + 1

        };

        let commentliketo = {

            like_no: comment_like + 1,
            comment_no: comment_no,
            username: id,
            like_check: true

        };
        console.log("comment like is " + commentlike)

        BoardService.getCommentliketoByNum(comment_no, id).then(res => {
            console.log("what is that " + JSON.stringify(res.data));

            if (res.data === 0) {
                BoardService.createcommentlikt(commentliketo).then(res => {
                    console.log("delete result => " + JSON.stringify(res));
                    if (res.status === 200) {
                        BoardService.updateComment(comment_no, comment).then(res => {
                            console.log("delete result => " + JSON.stringify(res));
                            if (res.status === 200) {
                                window.location.replace('/read-board/' + this.state.num);
                            } else {
                                window.alert("수정이 실패했습니다.");
                            }
                        }
                        );



                    } else {
                        window.alert("수정이 실패했습니다.");
                    }
                });

            }
            else {
                window.alert("이미 좋아요를 완료했습니다");
            }
        });


    }
    gettags() {
        if (this.state.board.category != '홍보게시판' && this.state.board.category != '공지사항' && this.state.board.category != "건의사항") {

            return (
                <div><label> <div style={{ border: "5px", borderColor: "black" }}>
                    TAG: #{this.state.board.tag1} , #{this.state.board.tag2}   , #{this.state.board.tag3},
             #{this.state.board.tag4}, #{this.state.board.tag5}  </div></label></div>
            )
        }
    }

    checkid(boardid) {
        console.log("checkid" + this.state.id + boardid)
        if (this.state.id == boardid) {
            return (
                <div style={{ position: "absolute", bottom: "10px", right: "5%" }}>
                    {<button className="main-btn" onClick={this.likeboard} >🤍{this.state.board.board_like}</button>}
                    <button className="main-btn" onClick={this.goToUpdate} >글 수정</button>
                    <button className="main-btn-cancle" onClick={() => this.deleteView()} >글 삭제</button>
                </div>
            )
        }
        else if (this.state.board.category != '홍보게시판' && this.state.board.category != '공지사항' && this.state.board.category != "건의사항") {
            return (
                <div style={{ position: "absolute", bottom: "10px", right: "5%" }}>
                    {<button className="main-btn" onClick={this.likeboard} >🤍{this.state.board.board_like}</button>}
                </div>
            )
        }

    }
    AllHotBoard() {
        this.props.history.push(`/Allhotboard`);
    }
    render() {
        return (

            <div class="container-fluid" >
                <div class="row">
                    <div class="col-lg-9">
                        <div >
                            <div className="card col-md-10 offset-md-1" >
                                <div className="row">
                                    &nbsp;&nbsp;&nbsp;<h5 style={{ color: "gray", padding: "5px" }}> [{this.state.board.category}] </h5>
                                </div>
                                <h3 className="text-center"> {this.state.board.title}</h3>
                                <br />
                                <div className="image-div">


                                    {this.getTitle(this.state.board.filepath)}
                                    

                                </div>
                                <div className="row">
                                    <h5 style={{ display: 'inline' }}>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.board.id}</h5>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.returnDate(this.state.board.board_date)}
                                </div>

                                <div className="card-body" style={{ display: 'inline' }}>

                                    <div className="row">
                                        <br />
                                        <hr style={{ width: "100%", color: "black" }} />
                                        {this.state.board.question}
                                    </div >
                                    <br />
                                    {this.gettags()}
                                    <br />
                                    <br />
                                    <div style={{ position: "absolute", bottom: "10px", left: "5%" }}>
                                        <button className="main-btn" onClick={this.goToList.bind(this)} >목록</button>
                                    </div>

                                    {this.checkid(this.state.board.id)}


                                </div>
                            </div>


                            {this.getcommentboard(this.state.comments)}

                        </div>

                    </div>
                    <div class="col-lg-3">
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
                        <br />
                        <div >
                            <div className="single-features text-center mt-30">
                                <div className="department-content text-center">
                                    <h4 className="department-title">
                                        #인기태그
                                            </h4>
                                    <p className="text">

                                        {this.returnTag()}

                                    </p>
                                </div>

                            </div>

                            <div className="single-features text-center mt-30">
                                <div className="department-content text-center">

                                    <h4 className="department-title" onClick={() => this.AllHotBoard()} >
                                        HOT 게시물
                                        </h4>
                                    <table className="table-board">
                                        <tbody>
                                            {this.state.hots.map(
                                                hot =>
                                                    <tr className="tr">
                                                        <a className="hot" onClick={() => this.readBoard(hot.board_no)}>{hot.title} <img src={heart} style={{ width: "20px", height: "20px", marginBottom: "3px" }} alt='heart' ></img>{hot.board_like} 🗨️ {hot.commentcount}</a>
                                                    </tr>
                                            )}
                                        </tbody>
                                    </table> <br />
                                </div>
                            </div>
                        </div>

                        <div className="single-features text-center mt-30">
                            <div className="department-content text-center">
                                <h4 className="department-title">
                                    연관질문
                                        </h4>
                                <table className="table-board">
                                    <tbody>
                                        {
                                            this.state.similar.map(
                                                simi =>
                                                    <tr className="tr">
                                                        <a className="hot" onClick={() => this.readBoard(simi.board_no)}>{simi.title}
                                                            <img src={heart} style={{ width: "20px", height: "20px", marginBottom: "3px" }} alt='heart' ></img>{simi.board_like} 🗨️{simi.commentcount}</a></tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>{/* 검색, 태그 div*/}

                </div>
            </div>
        );
    }
}

export default ReadBoardComponent;