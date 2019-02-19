/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import ExternalLink from 'components/external-link';

class GSuiteUserItem extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		onClick: PropTypes.func,
	};

	shouldComponentUpdate( nextProps ) {
		return this.props.user !== nextProps.user || this.props.onClick !== nextProps.onClick;
	}

	getLoginLink = () => {
		const { email, domain } = this.props.user;
		return `https://accounts.google.com/AccountChooser?Email=${ email }&service=CPanel&continue=https://admin.google.com/a/${ domain }`;
	};

	render() {
		return (
			<li>
				{ /* eslint-disable-next-line wpcalypso/jsx-classname-namespace */ }
				<span className="gsuite-user-item__email">{ this.props.user.email }</span>
				<ExternalLink
					icon
					className="gsuite-user-item__manage-link" // eslint-disable-line wpcalypso/jsx-classname-namespace
					href={ this.getLoginLink() }
					onClick={ this.props.onClick }
					target="_blank"
					rel="noopener noreferrer"
				>
					{ this.props.translate( 'Manage', { context: 'G Suite user item' } ) }
				</ExternalLink>
			</li>
		);
	}
}

export default localize( GSuiteUserItem );
