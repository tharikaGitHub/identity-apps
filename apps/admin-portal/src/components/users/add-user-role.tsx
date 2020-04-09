/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import _ from "lodash";
import { Forms } from "@wso2is/forms";
import { TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import { RolesInterface } from "../../models";

/**
 * Proptypes for the application consents list component.
 */
interface AddUserRoleProps {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    handleRoleListChange: (roles: any) => void;
    handleTempListChange: (roles: any) => void;
    handleInitialTempListChange: (groups: any) => void;
    handleInitialRoleListChange: (groups: any) => void;
    handleSetRoleId: (groupId: string) => void;
}

/**
 * User role component.
 *
 * @return {JSX.Element}
 */
export const AddUserRole: FunctionComponent<AddUserRoleProps> = (props: AddUserRoleProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        handleRoleListChange,
        handleTempListChange,
        handleInitialTempListChange,
        handleInitialRoleListChange,
        handleSetRoleId
    } = props;

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RolesInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<RolesInterface[]>([]);
    const [ isSelectUnassignedRolesAllRolesChecked, setIsSelectUnassignedAllRolesChecked ] = useState(false);
    const [ isSelectAssignedAllRolesChecked, setIsSelectAssignedAllRolesChecked ] = useState(false);

    useEffect(() => {
        if (isSelectAssignedAllRolesChecked) {
            setCheckedAssignedListItems(initialValues?.tempRoleList);
        } else {
            setCheckedAssignedListItems([])
        }
    }, [ isSelectAssignedAllRolesChecked ]);

    useEffect(() => {
        if (isSelectUnassignedRolesAllRolesChecked) {
            setCheckedUnassignedListItems(initialValues?.roleList);
        } else {
            setCheckedUnassignedListItems([])
        }
    }, [ isSelectUnassignedRolesAllRolesChecked ]);

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllUnAssignedList = () => {
        setIsSelectUnassignedAllRolesChecked(!isSelectUnassignedRolesAllRolesChecked);
    };

    /**
     * The following function enables the user to deselect all the roles at once.
     */
    const selectAllAssignedList = () => {
        setIsSelectAssignedAllRolesChecked(!isSelectAssignedAllRolesChecked);
    };

    const handleUnselectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            initialValues.roleList && initialValues.roleList.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredRoleList.push(role);
                    handleRoleListChange(filteredRoleList);
                }
            });
        } else {
            handleRoleListChange(initialValues?.initialRoleList);
        }
    };

    const handleSelectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            initialValues.tempRoleList && initialValues.tempRoleList.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredRoleList.push(role);
                    handleTempListChange(filteredRoleList);
                }
            });
        } else {
            handleTempListChange(initialValues?.initialTempRoleList);
        }
    };

    const addRoles = () => {
        const addedRoles = [ ...initialValues.tempRoleList ];
        if (checkedUnassignedListItems?.length > 0) {
            checkedUnassignedListItems.map((role) => {
                if (!(initialValues?.tempRoleList?.includes(role))) {
                    addedRoles.push(role);
                }
            });
        }
        handleTempListChange(addedRoles);
        handleInitialTempListChange(addedRoles);
        handleRoleListChange(initialValues?.roleList.filter(x => !addedRoles?.includes(x)));
        handleInitialRoleListChange(initialValues?.roleList.filter(x => !addedRoles?.includes(x)));
        setIsSelectUnassignedAllRolesChecked(false);
    };

    const removeRoles = () => {
        const removedRoles = [ ...initialValues?.roleList ];
        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((role) => {
                if (!(initialValues?.roleList?.includes(role))) {
                    removedRoles.push(role);
                }
            });
        }
        handleRoleListChange(removedRoles);
        handleInitialRoleListChange(removedRoles);
        handleTempListChange(initialValues?.tempRoleList?.filter(x => !removedRoles?.includes(x)));
        handleInitialTempListChange(initialValues?.tempRoleList?.filter(x => !removedRoles?.includes(x)));
        setCheckedAssignedListItems(checkedAssignedListItems.filter(x => !removedRoles?.includes(x)));
        setIsSelectAssignedAllRolesChecked(false);
    };

    const handleUnassignedItemCheckboxChange = (role) => {
        const checkedRoles = [ ...checkedUnassignedListItems ];

        if (checkedRoles.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
            setCheckedUnassignedListItems(checkedRoles);
        } else {
            checkedRoles.push(role);
            setCheckedUnassignedListItems(checkedRoles);
        }
    };

    const handleAssignedItemCheckboxChange = (role) => {
        const checkedRoles = [ ...checkedAssignedListItems ];

        if (checkedRoles.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
            setCheckedAssignedListItems(checkedRoles);
        } else {
            checkedRoles.push(role);
            setCheckedAssignedListItems(checkedRoles);
        }
    };

    /**
     * The following method handles creating a label for the list item.
     *
     * @param roleName: string
     */
    const createItemLabel = (roleName: string) => {
        const role = roleName.split("/");
        if (role.length > 0) {
            if (role[0] == "Application") {
                return { labelText: "Application", labelColor: null, name: "application-label" };
            } else {
                return { labelText: "Internal", labelColor: null, name: "internal-label" };
            }
        }
    };

    return (
        <>
        <Forms
            onSubmit={ () => {
                onSubmit({ roles: initialValues?.tempRoleList });
            } }
            submitState={ triggerSubmit }
        >
            <TransferComponent
                searchPlaceholder="Search roles"
                addItems={ addRoles }
                removeItems={ removeRoles }
                handleUnelectedListSearch={ handleUnselectedListSearch }
                handleSelectedListSearch={ handleSelectedListSearch }
            >
                <TransferList
                    isListEmpty={ !(initialValues?.roleList?.length > 0) }
                    listType="unselected"
                    listHeaders={ [ "Domain", "Name", "" ] }
                    handleHeaderCheckboxChange={ selectAllUnAssignedList }
                    isHeaderCheckboxChecked={ isSelectUnassignedRolesAllRolesChecked }
                >
                    {
                        initialValues?.roleList?.map((role, index)=> {
                            const roleName = role?.displayName?.split("/");
                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleUnassignedItemCheckboxChange(role) }
                                    key={ index }
                                    listItem={ roleName?.length > 0 ? roleName[1] : role?.displayName }
                                    listItemId={ role.id }
                                    listItemIndex={ index }
                                    listItemTypeLabel={ createItemLabel(role?.displayName) }
                                    isItemChecked={ checkedUnassignedListItems.includes(role) }
                                    showSecondaryActions={ true }
                                    handleOpenPermissionModal={ () => handleSetRoleId(role.id) }
                                />
                            )
                        })
                    }
                </TransferList>
                <TransferList
                    isListEmpty={ !(initialValues?.tempRoleList?.length > 0) }
                    listType="selected"
                    listHeaders={ [ "Domain", "Name" ] }
                    handleHeaderCheckboxChange={ selectAllAssignedList }
                    isHeaderCheckboxChecked={ isSelectAssignedAllRolesChecked }
                >
                    {
                        initialValues?.tempRoleList?.map((role, index)=> {
                            const roleName = role.displayName.split("/");
                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleAssignedItemCheckboxChange(role) }
                                    key={ index }
                                    listItem={ roleName?.length > 0 ? roleName[1] : role?.displayName }
                                    listItemId={ role.id }
                                    listItemIndex={ index }
                                    listItemTypeLabel={ createItemLabel(role.displayName) }
                                    isItemChecked={ checkedAssignedListItems.includes(role) }
                                    showSecondaryActions={ false }
                                />
                            )
                        })
                    }
                </TransferList>
            </TransferComponent>
        </Forms>
        </>
    );
};
