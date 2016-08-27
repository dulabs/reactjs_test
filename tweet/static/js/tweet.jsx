var TweetShow = React.createClass({

    componentDidMount: function(){
        $('#modal-status').modal('show');
        $('#modal-status').on('hidden.bs.modal', this.props.handleHideModal);
    },

    getInitialState: function() {
        return { tweet: null};
    },

    render: function(){

        return (

            <div className="modal show" id="modal-status" role="dialog" aria-labelledby="myModalStatus">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-body">
                    <p className="status-text">{ this.props.tweet.text }</p>
                    <span className="created_at">{ this.props.tweet.created_at }</span>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

        );

    },
    propTypes:{
        handleHideModal: React.PropTypes.func.isRequired
    }
});

var TweetBox = React.createClass({

    componentDidMount: function() {
        this.refs.statusText.focus();
    },

    updateStatus: function(message)
    {
        var params = {
            message: message
        };

        $.extend(true,params,api);

        $.post(twitter.statuses.update,params,function(response){

            console.log(response);

            this.props.getTweets();
            this.refs.statusText.value = null;

        }.bind(this));
    },

    _handleKeyPress: function(e)
    {

        if(e.key === 'Enter' ) {
            this.updateStatus(this.refs.statusText.value);
            //this.props.getTweets();
        }

    },

    render: function(){

            return (
                <div className="tweet-box">
                    <div className="form-group">
                        <input type="text" placeholder="Update Your Status Here!" className="form-control" onKeyPress={this._handleKeyPress} ref="statusText" name="tweet" max="140" />
                        <p>
                            <small>Press Enter to publish</small>
                        </p>
                    </div>
                </div>
            );

    }

});


var TweetList = React.createClass({

    getInitialState: function(){
        return { tweets: [],
                 view: {
                        showModal: false,
                        tweet: null
                        }
               };
    },

    componentDidMount: function() {
        this.getTweets();
    },

    onClickHideModal: function()
    {
        this.setState( {view: {showModal:false} } );
    },

    onClickShow: function(index,event)
    {
        var tweet = this.state.tweets[index];

        var params = {
                id: tweet.id_str
            };

        $.extend(true, params, api);

        $.post(twitter.statuses.show,params,function(response){

            this.setState( {
                            view: {
                                showModal:true,
                                tweet: response
                                }
                            }
                        );

            this.getTweets();

        }.bind(this))
        .fail(function(){
            alert('Sorry, we got error. Please refresh!');
        });
    },

    onClickDelete: function(index,event) {
        var tweet = this.state.tweets[index];

        var params = {
                id: tweet.id_str
            };

        $.extend(true, params, api);

        $.post(twitter.statuses.destroy,params,function(response){
            this.getTweets();
        }.bind(this))
        .fail(function(){
            alert('Sorry, we got error. Please refresh!');
        });
    },

    getTweets: function() {
       var data = {
                screen_name: api.screen_name,
                count: 5
        };

        $.extend(true,data,api);

        $.post(twitter.statuses.user_timeline,data,function(response){
            this.setState({tweets: response});
        }.bind(this));

    },

    render: function(){

            var tweets = this.state.tweets.map(function(data,i){
                                return <div className="tweet-status" key={i} id={ "tweet-"+data.id_str}>
                                           <div className="tweet-head">
                                                <img src={ data.user.profile_image_url } alt={ data.user.name } />
                                           </div>
                                           <div className="content" onClick={ this.onClickShow.bind(this,i) }>
                                               <span className="created_at">{ data.created_at }</span>
                                                <p>
                                                    { data.text }
                                                </p>
                                            </div>
                                             <div className="util">
                                                <ul className="nav nav-pills">
                                                    <li>
                                                        <a href="javascript:void(0);" onClick={ this.onClickDelete.bind(this,i) } >
                                                            <i className="fa fa-trash"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                       </div>
                            }.bind(this));


            return (
                <div className="row">
                    <div className="col-md-12 col-xs-12">
                        <TweetBox getTweets={ this.getTweets } />
                    </div>
                    <div className="col-md-12 col-xs-12">
                        <div className="tweet-list">
                        {
                            tweets
                        }
                        </div>

                        { this.state.view.showModal ? <TweetShow tweet={ this.state.view.tweet } handleHideModal={ this.onClickHideModal } /> : null }
                    </div>
                </div>
            );

    }

});


ReactDOM.render(<TweetList />,
    document.getElementById("tweets"));
