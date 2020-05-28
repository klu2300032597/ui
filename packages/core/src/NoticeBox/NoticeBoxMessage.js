import React from 'react'
import { colors } from '@dhis2/ui-constants'
import propTypes from '@dhis2/prop-types'

export const NoticeBoxMessage = ({ children, dataTest }) => {
    if (!children) {
        return null
    }

    return (
        <div data-test={dataTest}>
            {children}

            <style jsx>{`
                div {
                    color: ${colors.grey900};
                    font-size: 14px;
                    line-height: 20px;
                }
            `}</style>
        </div>
    )
}

NoticeBoxMessage.propTypes = {
    dataTest: propTypes.string.isRequired,
    children: propTypes.node,
}
