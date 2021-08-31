import { useOnlineStatus } from '@dhis2/app-runtime'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from './locales/index.js'
import styles from './online-status.styles.js'

/** A badge to display online/offline status in the header bar */
export function OnlineStatus({ info, dense }) {
    const { online } = useOnlineStatus()
    const displayStatus = online ? i18n.t('Online') : i18n.t('Offline')

    return (
        <div
            className={cx('container', dense ? 'bar' : 'badge')}
            data-test="headerbar-online-status"
        >
            {info && !dense && <span className="info">{info}</span>}
            <div className={cx('icon', online ? 'online' : 'offline')}></div>
            <span className="label">{displayStatus}</span>
            {info && dense && <span className="info-dense">{info}</span>}
            <style jsx>{styles}</style>
        </div>
    )
}
OnlineStatus.propTypes = {
    /** If true, displays as a sub-bar instead of a badge */
    dense: PropTypes.bool,
    /** Additional text to display beside status */
    info: PropTypes.string,
}
