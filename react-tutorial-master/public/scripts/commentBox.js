var data = [
	{id: 1, author: "Pete Hunt", text: "This is one comment"},
  	{id: 2, author: "Jordan Walke", text: "This is *another* comment"}	
];

/* A comment box component, which is a container for all the components below.  */
var CommentBox = React.createClass({
	
	/* Request comments from server */
	loadCommentsFromServer: function() {
		   $.ajax({
				url: this.props.url,
				dataType: 'json',
				cache: false,
				success: function(data) {
					this.setState({data: data});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(this.props.url, status, err.toString());
				}.bind(this)
			});
	},
	
	handleCommentSubmit: function(comment) {
    	   $.ajax({
				url: this.props.url,
				dataType: 'json',
				type: 'POST',
				data: comment,
				success: function(data) {
					this.setState({data: data});
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(this.props.url, status, err.toString());
				}.bind(this)
			});
  	},
	/* Set initial state of CommentBox - executes exactly once during the lifecycle of the component. */
	getInitialState: function() {
		return {data:[]};
	},
	
	/* Called automatically after the component is rendered for the first time. */
	componentDidMount: function() {
		this.loadCommentsFromServer();
    	setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	
	render: function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
			</div>
		);
	}
});

/* A comment list that will contain comments.  */
var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map((comment)=> {
			return (
				<Comment author={comment.author} key={comment.id}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

/* A comment form for user to enter comments. */
var CommentForm = React.createClass({
	initialState: {
			author: '',
			text: ''
	},
	getInitialState: function() {
		return this.initialState;
	},
	handleAuthorChange: function(e) {
		this.setState({author: e.target.value});
	},
	handleTextChange: function(e) {
		this.setState({text: e.target.value});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.state.author.trim();
		var text = this.state.text.trim();
		if (text && author) {
			this.props.onCommentSubmit({author: author, text: text});
			this.setState(this.initialState);
		}	
	},
	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input 
					type="text" 
					placeholder="Your name" 
					value={this.state.author}
					onChange={this.handleAuthorChange}
				/>
				<input 
					type="text" 
					placeholder="Say something..."
					value={this.state.text}
					onChange={this.handleTextChange}
				/>
				<input type="submit" value="Post" />
			</form>
		)
	}
});

/* The comment */
var Comment = React.createClass({
	render: function() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
					{this.props.children}
			</div>	
		);
	}	
});

ReactDOM.render(
	<CommentBox url="/api/comments" 
	pollInterval={2000}
	/>, 
	document.getElementById('content')
)