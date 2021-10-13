import { CircularLoader } from '@dhis2-ui/loader'
import { Node } from '@dhis2-ui/node'
import PropTypes from 'prop-types'
import React from 'react'
import { resolve } from 'styled-jsx/css'
import i18n from '../locales/index.js'
import { orgUnitPathPropType } from '../prop-types.js'
import { computeChildNodes } from './compute-child-nodes.js'
import { ErrorMessage } from './error-message.js'
import { hasDescendantSelectedPaths } from './has-descendant-selected-paths.js'
import { Label } from './label/index.js'
import { useOpenState } from './use-open-state.js'
import { useOrgData } from './use-org-data/index.js'

const loadingSpinnerStyles = resolve`
    .extrasmall {
        display: block;
        margin: 3px 0;
    }
`

const LoadingSpinner = () => (
    <div>
        <CircularLoader extrasmall className={loadingSpinnerStyles.className} />
        <style>{loadingSpinnerStyles.styles}</style>
        <style jsx>{`
            div {
                width: 24px;
            }
        `}</style>
    </div>
)

export const OrganisationUnitNode = ({
    autoExpandLoadingError,
    dataTest,
    disableSelection,
    displayName,
    expanded,
    highlighted,
    id,
    isUserDataViewFallback,
    path,
    renderNodeLabel,
    selected,
    singleSelection,
    filter,
    suppressAlphabeticalSorting,
    onChange,
    onChildrenLoaded,
    onCollapse,
    onExpand,
}) => {
    const { loading, error, data } = useOrgData(id, {
        isUserDataViewFallback,
        suppressAlphabeticalSorting,
        displayName,
        onComplete: onChildrenLoaded,
    })

    const childNodes = !loading && !error ? computeChildNodes(data, filter) : []
    const hasChildren = !!childNodes.length
    const hasSelectedDescendants = hasDescendantSelectedPaths(path, selected)
    const isHighlighted = highlighted.includes(path)
    const { open, onToggleOpen } = useOpenState({
        autoExpandLoadingError,
        errorMessage: error && error.toString(),
        path,
        expanded,
        onExpand,
        onCollapse,
    })

    const isSelected = selected.includes(path)

    const labelContent = renderNodeLabel({
        disableSelection,
        hasChildren,
        hasSelectedDescendants,
        loading,
        error,
        selected,
        open,
        path,
        singleSelection,
        node: data,
        label: data.displayName,
        checked: isSelected,
        highlighted: isHighlighted,
    })

    const label = (
        <Label
            node={data}
            open={open}
            loading={loading}
            checked={isSelected}
            onChange={onChange}
            dataTest={`${dataTest}-label`}
            selected={selected}
            hasChildren={hasChildren}
            highlighted={isHighlighted}
            onToggleOpen={onToggleOpen}
            disableSelection={disableSelection}
            singleSelection={singleSelection}
            hasSelectedDescendants={hasSelectedDescendants}
        >
            {labelContent}
        </Label>
    )

    /**
     * No children means no arrow, therefore we have to provide something.
     * While "loading" is true, "hasChildren" is false
     * There are some possible children variants as content of this node:
     *
     * 1. Nothing; There are no children
     * 2. Placeholder: There are children, but the Node is closed (show arrow)
     * 3. Error: There are children and loading information somehow failed
     * 4. Child nodes: There are children and the node is open
     */
    const showPlaceholder = hasChildren && !open && !error
    const showChildNodes = hasChildren && open && !error

    return (
        <Node
            dataTest={`${dataTest}-node`}
            open={open}
            onOpen={onToggleOpen}
            onClose={onToggleOpen}
            component={label}
            icon={loading && <LoadingSpinner />}
        >
            {error && (
                <ErrorMessage dataTest={dataTest}>
                    {i18n.t('Could not load children')}
                </ErrorMessage>
            )}
            {showPlaceholder && <span data-test={`${dataTest}-placeholder`} />}
            {showChildNodes &&
                childNodes.map((child) => {
                    const childPath = `${path}/${child.id}`
                    const grandChildNodes = computeChildNodes(child, filter)

                    return (
                        <OrganisationUnitNode
                            key={childPath}
                            autoExpandLoadingError={autoExpandLoadingError}
                            childNodes={grandChildNodes}
                            dataTest={dataTest}
                            disableSelection={disableSelection}
                            displayName={child.displayName}
                            expanded={expanded}
                            filter={filter}
                            highlighted={highlighted}
                            id={child.id}
                            isUserDataViewFallback={isUserDataViewFallback}
                            suppressAlphabeticalSorting={
                                suppressAlphabeticalSorting
                            }
                            path={childPath}
                            renderNodeLabel={renderNodeLabel}
                            selected={selected}
                            singleSelection={singleSelection}
                            onChange={onChange}
                            onChildrenLoaded={onChildrenLoaded}
                            onCollapse={onCollapse}
                            onExpand={onExpand}
                        />
                    )
                })}
        </Node>
    )
}

OrganisationUnitNode.propTypes = {
    dataTest: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    renderNodeLabel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,

    autoExpandLoadingError: PropTypes.bool,
    disableSelection: PropTypes.bool,
    displayName: PropTypes.string,
    expanded: PropTypes.arrayOf(orgUnitPathPropType),
    filter: PropTypes.arrayOf(orgUnitPathPropType),
    highlighted: PropTypes.arrayOf(orgUnitPathPropType),
    isUserDataViewFallback: PropTypes.bool,
    path: orgUnitPathPropType,
    selected: PropTypes.arrayOf(orgUnitPathPropType),
    singleSelection: PropTypes.bool,
    suppressAlphabeticalSorting: PropTypes.bool,

    onChildrenLoaded: PropTypes.func,
    onCollapse: PropTypes.func,
    onExpand: PropTypes.func,
}
