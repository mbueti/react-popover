import React from 'react';
import classnames from 'classnames';
import shouldPureComponentUpdate from 'react-pure-render/function';

//import './Popover.scss';

class PopoverStore {
	callbacks = {};

	on(event, cb) {
		if (!this.callbacks[event]) {
			this.callbacks[event] = [];
		}
		this.callbacks[event].push(cb);
	}

	trigger(event) {
		if (this.callbacks[event]) {
			this.callbacks[event].map((cb) => cb());
		}
	}

	off(event, cb) {
		if (this.callbacks[event]) {
			const idx = this.callbacks[event].indexOf(cb);
			if (idx > -1) {
				this.callbacks = [...this.callbacks.slice(0, idx), ...this.callbacks.slice(idx + 1)];
			}
		}
	}
}

export const popoverStore = new PopoverStore();

export class Popover extends React.Component {
	static propTypes = {
		trigger: React.PropTypes.any.isRequired,
		position: React.PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
		className: React.PropTypes.string,
		children: React.PropTypes.node,
	};

	static defaultProps = {
		position: 'top',
	};

	state = {
		isPopoverShown: false,
	};

	componentDidMount() {
		popoverStore.on('hide', ::this.hide);
	}

	shouldComponentUpdate = shouldPureComponentUpdate;

	componentWillUnmount() {
		popoverStore.off('hide', ::this.hide);
	}

	show() {
		this.immune = true;
		this.setState({ isPopoverShown: true });
	}

	hide() {
		if (!this.immune) {
			this.setState({ isPopoverShown: false });
		}
		this.immune = false;
	}

	toggle(e) {
		e.preventDefault();
		if (this.state.isPopoverShown) {
			this.hide();
		} else {
			this.show();
		}
	}

	render() {
		const popoverClasses = classnames('popover', this.props.className, `popover--${this.props.position}`, { 'popover--active': this.state.isPopoverShown });

		return (
			<div className={popoverClasses}>
				<a href="#" onClick={::this.toggle} className="popover__trigger">{this.props.trigger}</a>
				<div className="popover__content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export class PopoverWrapper extends React.Component {
	static propTypes = {
		children: React.PropTypes.node,
	};

	hidePopovers() {
		popoverStore.trigger('hide');
	}

	render() {
		return (
			<div onClick={this.hidePopovers} onTouchEnd={this.hidePopovers} {...this.props}>
				{this.props.children}
			</div>
		);
	}
}

export default Popover;