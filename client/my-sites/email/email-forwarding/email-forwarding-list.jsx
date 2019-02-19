/** @format */

/**
 * External dependencies
 */

import React from 'react';

import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import EmailForwardingItem from './email-forwarding-item';

class EmailForwardingList extends React.Component {
	render() {
		const { hasLoadedFromServer, list } = this.props.emailForwarding;

		if ( ! list && ! hasLoadedFromServer ) {
			return <span>{ this.props.translate( 'Loading…' ) }</span>;
		}

		if ( ! list ) {
			return null;
		}

		const emailForwardingItems = list.map( emailForwarding => {
			return (
				<EmailForwardingItem
					key={ emailForwarding.email }
					emailData={ emailForwarding }
					selectedSite={ this.props.selectedSite }
				/>
			);
		} );

		return <ul className="email-forwarding__list">{ emailForwardingItems }</ul>; // eslint-disable-line wpcalypso/jsx-classname-namespace
	}
}

export default localize( EmailForwardingList );
