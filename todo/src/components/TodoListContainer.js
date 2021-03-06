import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	addTodo,
	deleteTodo,
	toggleComplete,
	editTodo,
	loadTodos,
	changeVisibility,
	clearTodoList,
	clearCompleted,
} from '../actions';

import '../styles/TodoList.css';

class TodoList extends Component {
	constructor() {
		super();
		this.state = {
			text: '',
			edit: '',
			isEditingId: -1,
			visibility: '',
		};
	}

	componentDidMount() {
		if (localStorage.getItem('todos')) {
			this.props.loadTodos(JSON.parse(localStorage.getItem('todos')));
		}

		this.setState({
			visibility: undefined,
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.todos !== this.props.todos)
			localStorage.setItem('todos', JSON.stringify(nextProps.todos));
	}

	handleTodoInput = e => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	addTodoHandler = e => {
		e.preventDefault();

		if (this.state.text === '') {
			window.alert('Your to do is empty! There is nothing to add!');
			return;
		}

		const text = this.state.text;
		const newTodo = {
			text,
			completed: false,
			id: this.checkId(0),
		};
		this.props.addTodo(newTodo);

		this.setState({
			text: '',
		});
	};

	checkId = id => {
		let idExists = false;

		this.props.todos.forEach(todo => {
			if (todo.id === id) {
				idExists = true;
				return null;
			}
		});

		if (idExists) return this.checkId(++id);
		return id;
	};

	deleteTodoHandler = id => {
		this.props.deleteTodo(id);
	};

	toggleCompleteHandler = id => {
		this.setState({ isEditing: false });
		this.props.toggleComplete(id);
	};

	isEditing = todo => {
		this.setState({
			edit: todo.text,
			isEditingId: todo.id,
		});
	};

	editTodoHandler = todo => {
		const edit = this.state.edit;
		const editedTodo = {
			text: edit,
			completed: todo.completed,
			id: todo.id,
		};

		this.props.editTodo(editedTodo);

		this.setState({
			edit: '',
			isEditingId: -1,
		});
	};

	changeVisibilityHandler(filter) {
		this.setState({ visibility: filter });
		this.props.changeVisibility();
	}

	clearTodoListHandler = () => {
		if (this.props.todos.length > 0) {
			if (
				window.confirm(
					'You are about to delete ALL your to do items. This CANNOT be undone. Are you sure you want to continue?'
				)
			)
				this.props.clearTodoList();
		} else window.alert('Your list is empty! There is nothing to clear!');
	};

	clearCompletedHandler = () => {
		this.props.clearCompleted();
	};

	render() {
		return (
			<div className="TodoListContainer">
				<br />
				<div className="AddTodoSection">
					<form className="InputForm" onSubmit={this.addTodoHandler}>
						<input
							onChange={this.handleTodoInput}
							name="text"
							value={this.state.text}
						/>
					</form>

					<button
						className="AddTodoButton"
						type="button"
						onClick={this.addTodoHandler}
					>
						+
					</button>
				</div>

				<br />

				<div>
					<button
						className="ShowIncompleteButton"
						onClick={() => this.changeVisibilityHandler(false)}
						style={
							this.state.visibility === false ? { fontWeight: 'bold' } : null
						}
					>
						Incomplete
					</button>
					<button
						className="ShowAllButton"
						onClick={() => this.changeVisibilityHandler(undefined)}
						style={
							this.state.visibility === undefined
								? { fontWeight: 'bold' }
								: null
						}
					>
						All
					</button>
					<button
						className="ShowCompletedButton"
						onClick={() => this.changeVisibilityHandler(true)}
						style={
							this.state.visibility === true ? { fontWeight: 'bold' } : null
						}
					>
						Completed
					</button>
				</div>

				<br />

				<div className="TodoList">
					{this.props.todos
						.filter(todo => {
							return this.state.visibility !== undefined
								? todo.completed === this.state.visibility
								: todo;
						})
						.map(todo => {
							return (
								<div key={todo.id} className="TodoContainer">
									<button
										className="DeleteButton"
										onClick={() => this.deleteTodoHandler(todo.id)}
									>
										&#x2717;
									</button>

									{todo.completed ? (
										<div className="TodoItemContainer">
											<button
												className="ToggleCompleteButton"
												onClick={() => this.toggleCompleteHandler(todo.id)}
												style={{ opacity: 0.2 }}
											>
												&#x2713;
											</button>

											<li
												className="TodoItem"
												style={{ textDecoration: 'line-through', opacity: 0.2 }}
											>
												{todo.text}
											</li>
										</div>
									) : (
										<div className="TodoItemContainer">
											<button
												className="ToggleCompleteButton"
												onClick={() => this.toggleCompleteHandler(todo.id)}
											>
												&#x2713;
											</button>

											{this.state.isEditingId === todo.id ? (
												<button
													className="EditTodoButton"
													onClick={() => this.editTodoHandler(todo)}
												>
													done
												</button>
											) : (
												<button
													className="EditTodoButton"
													onClick={() => this.isEditing(todo)}
												>
													edit
												</button>
											)}

											{this.state.isEditingId === todo.id ? (
												<input
													className="EditTodo"
													onChange={this.handleTodoInput}
													name="edit"
													value={this.state.edit}
													placeholder={todo.text}
												/>
											) : (
												<li className="TodoItem">{todo.text}</li>
											)}
										</div>
									)}
								</div>
							);
						})}
				</div>

				<br />

				<div>
					<button className="ClearTodoList" onClick={this.clearTodoListHandler}>
						Clear ALL to do items
					</button>
					<button
						className="ClearCompletedButton"
						onClick={this.clearCompletedHandler}
					>
						Clear completed to do items
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		todos: state.todos,
	};
};

export default connect(mapStateToProps, {
	addTodo,
	deleteTodo,
	toggleComplete,
	editTodo,
	loadTodos,
	changeVisibility,
	clearTodoList,
	clearCompleted,
})(TodoList);
