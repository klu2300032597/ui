import React from 'react'
import propTypes from '@dhis2/prop-types'
import { SwitchField } from '@dhis2/ui-widgets'

import {
    createToggleChangeHandler,
    createFocusHandler,
    createBlurHandler,
    hasError,
    isValid,
    getValidationText,
} from '../shared/helpers.js'
import { metaPropType, inputPropType } from '../shared/propTypes.js'

export const SwitchControl = ({
    error,
    input,
    meta,
    showValidStatus,
    valid,
    validationText,
    onBlur,
    onFocus,
    ...rest
}) => (
    <SwitchField
        {...rest}
        checked={input.checked}
        name={input.name}
        value={input.checked}
        error={hasError(meta, error)}
        valid={isValid(meta, valid, showValidStatus)}
        validationText={getValidationText(meta, validationText, error)}
        onFocus={createFocusHandler(input, onFocus)}
        onChange={createToggleChangeHandler(input)}
        onBlur={createBlurHandler(input, onBlur)}
    />
)

SwitchControl.propTypes = {
    input: inputPropType.isRequired,
    meta: metaPropType.isRequired,

    error: propTypes.bool,
    showValidStatus: propTypes.bool,
    valid: propTypes.bool,
    validationText: propTypes.string,

    onBlur: propTypes.func,
    onFocus: propTypes.func,
}
