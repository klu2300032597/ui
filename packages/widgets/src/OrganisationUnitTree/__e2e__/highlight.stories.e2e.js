import React from 'react'
import { storiesOf } from '@storybook/react'
import { CustomDataProvider } from '@dhis2/app-runtime'
import { OrganisationUnitTree } from '../OrganisationUnitTree.js'
import {
    StatefulMultiSelectionWrapper,
    dataProviderData,
    namespace,
} from './common'

storiesOf(namespace, module).add('Root highlighted', () => (
    <CustomDataProvider data={dataProviderData}>
        <StatefulMultiSelectionWrapper>
            {({ onChange }) => (
                <OrganisationUnitTree
                    roots="A0000000000"
                    onChange={onChange}
                    highlighted={['/A0000000000']}
                />
            )}
        </StatefulMultiSelectionWrapper>
    </CustomDataProvider>
))
