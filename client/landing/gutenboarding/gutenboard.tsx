/**
 * External dependencies
 */
import '@wordpress/editor'; // This shouldn't be necessary
import { useI18n } from '@automattic/react-i18n';
import { BlockEditorProvider, BlockList as OriginalBlockList } from '@wordpress/block-editor';
import { Popover, DropZoneProvider } from '@wordpress/components';
import { createBlock, registerBlockType } from '@wordpress/blocks';
import '@wordpress/format-library';
import { useDispatch, useSelect } from '@wordpress/data';
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { recordTracksPageViewWithPageParams } from '@automattic/calypso-analytics';

// Uncomment and remove the redundant sass import from `./style.css` when a release after @wordpress/components@8.5.0 is published.
// See https://github.com/WordPress/gutenberg/pull/19535
// import '@wordpress/components/build-style/style.css';

/**
 * Internal dependencies
 */
import Header from './components/header';
import DuplicateSiteModal from './components/duplicate-site-modal';
import { name, settings } from './onboarding-block';
import { Step, usePath } from './path';
import './style.scss';
import { STORE_KEY as ONBOARD_STORE } from './stores/onboard';
import { USER_STORE } from './stores/user';

registerBlockType( name, settings );

interface BlockListProps extends OriginalBlockList.Props {
	__experimentalUIParts: {
		hasPopover: boolean;
		hasSelectedUI: boolean;
	};
}

const BlockList = ( props: BlockListProps ) => <OriginalBlockList { ...props } />;

export function Gutenboard() {
	const { __: NO__ } = useI18n();

	// @TODO: This is currently needed in addition to the routing (inside the Onboarding Block)
	// for the 'Back' and 'Next' buttons in the header. If we remove those (and move navigation
	// entirely into the block), we'll be able to remove this code.
	const { step } = useParams();
	const makePath = usePath();
	let prev: undefined | string;
	switch ( step ) {
		case Step.DesignSelection:
			prev = makePath( Step.IntentGathering );
			break;
		case Step.PageSelection:
			prev = makePath( Step.DesignSelection );
			break;
	}

	// We're persisting the block via `useRef` in order to prevent re-renders
	// which would collide with the routing done inside of the block
	// (and would lead to weird mounting/unmounting behavior).
	const onboardingBlock = useRef( createBlock( name, {} ) );

	const history = useHistory();
	const { pathname } = history.location;

	useEffect( () => {
		recordTracksPageViewWithPageParams( `/gutenboarding${ pathname }` );
	}, [ pathname ] );

	const lastCreatedSiteIsCurrent = useSelect( select =>
		select( ONBOARD_STORE ).isLastCreatedSiteCurrent()
	);
	const lastCreatedSite = useSelect( select => select( ONBOARD_STORE ).getLastCreatedSite() );
	const currentUser = useSelect( select => select( USER_STORE ).getCurrentUser() );

	const [ showDuplicateSiteModal, setShowDuplicateSiteModal ] = useState< boolean | undefined >(
		undefined
	);

	const { resetOnboardStore } = useDispatch( ONBOARD_STORE );

	const handleDuplicateSiteModalClose = useCallback( () => {
		resetOnboardStore();
		setShowDuplicateSiteModal( false );
		history.push( makePath() );
	}, [ resetOnboardStore, setShowDuplicateSiteModal, history, makePath ] );

	useEffect( () => {
		if ( currentUser && lastCreatedSiteIsCurrent && showDuplicateSiteModal === undefined ) {
			// Show modal if last created site is current
			setShowDuplicateSiteModal( true );
		} else if (
			currentUser &&
			! lastCreatedSiteIsCurrent &&
			lastCreatedSite &&
			showDuplicateSiteModal === undefined
		) {
			// If last created site exists but is not current, clear store and redirect to
			// the beginning of the flow.
			handleDuplicateSiteModalClose();
		}
	}, [
		currentUser,
		lastCreatedSite,
		lastCreatedSiteIsCurrent,
		showDuplicateSiteModal,
		handleDuplicateSiteModalClose,
	] );

	/* eslint-disable wpcalypso/jsx-classname-namespace */
	return (
		<div className="block-editor__container">
			<DropZoneProvider>
				<div className="edit-post-layout">
					<Header prev={ prev } />
					{ showDuplicateSiteModal && (
						<DuplicateSiteModal onRequestClose={ handleDuplicateSiteModalClose } />
					) }
					<BlockEditorProvider
						useSubRegistry={ false }
						value={ [ onboardingBlock.current ] }
						settings={ {
							templateLock: 'all',
						} }
					>
						<div className="gutenboard__edit-post-layout-content edit-post-layout__content ">
							<div
								className="edit-post-visual-editor editor-styles-wrapper"
								role="region"
								aria-label={ NO__( 'Onboarding screen content' ) }
								tabIndex={ -1 }
							>
								<BlockList
									__experimentalUIParts={ {
										hasPopover: false,
										hasSelectedUI: false,
									} }
								/>
							</div>
						</div>
					</BlockEditorProvider>
				</div>
			</DropZoneProvider>
			<Popover.Slot />
		</div>
	);
	/* eslint-enable wpcalypso/jsx-classname-namespace */
}
