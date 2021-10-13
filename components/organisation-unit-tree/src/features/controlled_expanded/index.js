import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getOrganisationUnitData, namespace } from '../../__e2e__/common.js'

const expectOrgUnitsToBeDisplayed = (ids) => {
    const expandedLabels = ids.map(
        (id) => getOrganisationUnitData(id).displayName
    )

    expandedLabels.forEach((label) => {
        cy.get(`:contains("${label}")`).should('exist')
    })
}

const expectOrgUnitsToNotBeDisplayed = (ids) => {
    const expandedLabels = ids.map((id) => {
        const data = getOrganisationUnitData(id)
        return data.displayName
    })

    expandedLabels.forEach((label) => {
        cy.get(`:contains("${label}")`).should('not.exist')
    })
}

Given(
    'the initial state of the controlled expanded prop has some paths',
    () => {
        cy.visitStory(namespace, 'Controlled')
        cy.window().then((win) => {
            cy.wrap(win.initiallyExpandedPaths).as('providedPaths')
        })
    }
)

When('the org unit tree should is done loading the provided paths', () => {
    cy.window().then((win) => {
        const expandedIds = win.initiallyExpandedPaths.map(
            (path) => path.match(/[^/]+$/)[0]
        )

        expectOrgUnitsToBeDisplayed(expandedIds)
    })
})

When('the user clicks on a button to collapse one of the opened paths', () => {
    cy.window().then((win) => {
        cy.wrap([win.orgUnitPathToExpand]).as('providedPaths')
    })

    cy.get('[data-test="org-unit-toggle"]').click()
})

Then(
    'the org unit tree should open the provided paths when done loading',
    () => {
        cy.get('@providedPaths').then((providedPaths) => {
            const providedIds = providedPaths.map(
                (path) => path.match(/[^/]+$/)[0]
            )

            expectOrgUnitsToBeDisplayed(providedIds)
        })
    }
)

Then('the path should close', () => {
    cy.get('@providedPaths').then((providedPaths) => {
        const providedIds = providedPaths.map((path) => path.match(/[^/]+$/)[0])
        const hiddenChildrenIds = providedIds.reduce((acc, cur) => {
            const curData = getOrganisationUnitData(cur)
            const childrenIds = curData.children.map(({ id }) => id)
            return [...acc, ...childrenIds]
        }, [])

        expectOrgUnitsToNotBeDisplayed(hiddenChildrenIds)
    })
})
