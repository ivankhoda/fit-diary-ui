import { inject, observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPanel from '../../AdminPanel';
import AdminUsersController, { AdminUserUpdatePayload } from '../../controllers/AdminUsersController';
import AdminUsersStore, { AdminUserProfile } from '../../store/AdminUsersStore';
import {
    DEFAULT_ROLE_OPTIONS,
    EditableFieldName,
    EditableFields,
    EXCLUDED_READONLY_FIELDS,
    ReadonlyField,
    ReadonlyFields,
    RoleSelector,
    UserFormData,
} from './UserDataSections';
import './UserData.style.scss';

interface UserDataProps {
    adminUsersController?: AdminUsersController;
    adminUsersStore?: AdminUsersStore;
}

interface UseUserDetailActionsParams {
    adminUsersController: AdminUsersController;
    formData: UserFormData | null;
    navigate: ReturnType<typeof useNavigate>;
    parsedUserId: number;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<string>>;
    translate: (key: string) => string;
    userId?: string;
}

const JSON_INDENT = 2;

const getUserRoles = (user: AdminUserProfile | null): string[] => {
    if (!user) {
        return [];
    }

    if (Array.isArray(user.roles)) {
        return user.roles.filter((role): role is string => typeof role === 'string');
    }

    if (typeof user.role === 'string' && user.role.length > 0) {
        return [user.role];
    }

    return [];
};

const buildInitialFormData = (user: AdminUserProfile): UserFormData => ({
    email: typeof user.email === 'string' ? user.email : '',
    first_name: typeof user.first_name === 'string' ? user.first_name : '',
    last_name: typeof user.last_name === 'string' ? user.last_name : '',
    phone_number: typeof user.phone_number === 'string' ? user.phone_number : '',
    roles: getUserRoles(user),
    telegram_username: typeof user.telegram_username === 'string' ? user.telegram_username : '',
    username: typeof user.username === 'string' ? user.username : '',
});

const formatReadonlyValue = (value: unknown): Omit<ReadonlyField, 'key'> => {
    if (typeof value === 'boolean') {
        return { isComplex: false, value: value ? 'true' : 'false' };
    }

    if (value === null) {
        return { isComplex: false, value: 'null' };
    }

    if (typeof value === 'undefined') {
        return { isComplex: false, value: '' };
    }

    if (typeof value === 'object') {
        return { isComplex: true, value: JSON.stringify(value, null, JSON_INDENT) };
    }

    return { isComplex: false, value: String(value) };
};

const getReadonlyFields = (user: AdminUserProfile | null): ReadonlyField[] => {
    if (!user) {
        return [];
    }

    return Object.entries(user)
        .filter(([fieldName, fieldValue]) => !EXCLUDED_READONLY_FIELDS.has(fieldName) && typeof fieldValue !== 'undefined')
        .map(([fieldName, fieldValue]) => {
            const formattedValue = formatReadonlyValue(fieldValue);

            return {
                ...formattedValue,
                key: fieldName,
            };
        });
};

const buildUpdatePayload = (formData: UserFormData): AdminUserUpdatePayload => ({
    email: formData.email.trim(),
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    phone_number: formData.phone_number.trim(),
    role: formData.roles[0] || '',
    roles: formData.roles,
    telegram_username: formData.telegram_username.trim(),
    username: formData.username.trim(),
});

const useUserDetailForm = (currentUser: AdminUserProfile | null) => {
    const [formData, setFormData] = useState<UserFormData | null>(null);
    const [isProfileVisible, setIsProfileVisible] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (currentUser) {
            setFormData(buildInitialFormData(currentUser));
        }
    }, [currentUser]);

    const readonlyFields = useMemo(() => getReadonlyFields(currentUser), [currentUser]);
    const roleOptions = useMemo(() => {
        const selectedRoles = formData?.roles ?? [];

        return Array.from(new Set([...DEFAULT_ROLE_OPTIONS, ...selectedRoles]));
    }, [formData?.roles]);

    const handleToggleProfile = useCallback(() => {
        setIsProfileVisible(prevState => !prevState);
    }, []);

    const handleTextFieldChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = event.target.name as EditableFieldName;
        const fieldValue = event.target.value;

        setFormData(prevState => {
            if (!prevState) {
                return prevState;
            }

            return {
                ...prevState,
                [fieldName]: fieldValue,
            };
        });
    }, []);

    const handleRoleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const roleName = event.target.name;
        const isChecked = event.target.checked;

        setFormData(prevState => {
            if (!prevState) {
                return prevState;
            }

            const nextRoles = isChecked
                ? Array.from(new Set([...prevState.roles, roleName]))
                : prevState.roles.filter(role => role !== roleName);

            return {
                ...prevState,
                roles: nextRoles,
            };
        });
    }, []);

    const handleReset = useCallback(() => {
        if (!currentUser) {
            return;
        }

        setFormData(buildInitialFormData(currentUser));
        setError('');
        setSuccess('');
    }, [currentUser]);

    return {
        error,
        formData,
        handleReset,
        handleRoleChange,
        handleTextFieldChange,
        handleToggleProfile,
        isProfileVisible,
        isSaving,
        readonlyFields,
        roleOptions,
        setError,
        setIsSaving,
        setSuccess,
        success,
    };
};

const useUserDetailActions = ({
    adminUsersController,
    formData,
    navigate,
    parsedUserId,
    setError,
    setIsSaving,
    setSuccess,
    translate,
    userId,
}: UseUserDetailActionsParams) => {
    useEffect(() => {
        if (Number.isInteger(parsedUserId)) {
            adminUsersController.getUserById(parsedUserId);
        }
    }, [adminUsersController, parsedUserId]);

    const handleSave = useCallback(async() => {
        if (!formData || !Number.isInteger(parsedUserId)) {
            return;
        }

        setIsSaving(true);
        setError('');
        setSuccess('');

        const result = await adminUsersController.updateUser(parsedUserId, buildUpdatePayload(formData));

        if (result.ok) {
            setSuccess(translate('adminUserDetails.updateSuccess'));
        } else {
            setError(result.errors?.[0] || translate('adminUserDetails.updateError'));
        }

        setIsSaving(false);
    }, [adminUsersController,
        formData,
        parsedUserId,
        setError,
        setIsSaving,
        setSuccess,
        translate]);

    const handleWorkoutsClick = useCallback(() => {
        navigate(`/admin/users/${userId}/workouts`);
    }, [navigate, userId]);

    const handleSendEmail = useCallback(() => {
        if (Number.isInteger(parsedUserId)) {
            adminUsersController.sendEmail(parsedUserId);
        }
    }, [adminUsersController, parsedUserId]);

    const handleConfirm = useCallback(() => {
        if (Number.isInteger(parsedUserId)) {
            adminUsersController.confirm(parsedUserId);
        }
    }, [adminUsersController, parsedUserId]);

    const handlePermissionsClick = useCallback(() => {
        navigate(`/admin/users/${userId}/permissions`);
    }, [navigate, userId]);

    return {
        handleConfirm,
        handlePermissionsClick,
        handleSave,
        handleSendEmail,
        handleWorkoutsClick,
    };
};

const UserData: React.FC<UserDataProps> = ({ adminUsersController, adminUsersStore }) => {
    const { t } = useTranslation();
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    if (!adminUsersStore || !adminUsersController) {
        return null;
    }

    const currentUser = adminUsersStore.userProfile ?? null;
    const parsedUserId = userId ? parseInt(userId, 10) : Number.NaN;
    const {
        error,
        formData,
        handleReset,
        handleRoleChange,
        handleTextFieldChange,
        handleToggleProfile,
        isProfileVisible,
        isSaving,
        readonlyFields,
        roleOptions,
        setError,
        setIsSaving,
        setSuccess,
        success,
    } = useUserDetailForm(currentUser);
    const {
        handleConfirm,
        handlePermissionsClick,
        handleSave,
        handleSendEmail,
        handleWorkoutsClick,
    } = useUserDetailActions({
        adminUsersController,
        formData,
        navigate,
        parsedUserId,
        setError,
        setIsSaving,
        setSuccess,
        translate: t,
        userId,
    });
    const saveButtonText = isSaving ? t('loading') : t('workoutData.saveChanges');

    return (
        <AdminPanel>
            <div className="user-data-modal">
                <h2>{t('adminUserDetails.title')}</h2>

                <div className="user-profile">
                    <h3 onClick={handleToggleProfile}>
                        {t('adminUserDetails.profileInformation')} {isProfileVisible ? '▼' : '▲'}
                    </h3>
                    {isProfileVisible && (
                        <div className="user-section">
                            {error && <p className="user-message error-message">{error}</p>}
                            {success && <p className="user-message success-message">{success}</p>}

                            {formData
                                ? (
                                    <>
                                        <EditableFields
                                            formData={formData}
                                            isSaving={isSaving}
                                            onChange={handleTextFieldChange}
                                            translate={t}
                                        />
                                        <RoleSelector
                                            isSaving={isSaving}
                                            onChange={handleRoleChange}
                                            roleOptions={roleOptions}
                                            selectedRoles={formData.roles}
                                            translate={t}
                                        />
                                        <ReadonlyFields fields={readonlyFields} translate={t} />

                                        <div className="primary-actions">
                                            <button disabled={isSaving} onClick={handleSave} type="button">
                                                {saveButtonText}
                                            </button>
                                            <button disabled={isSaving} onClick={handleReset} type="button">
                                                {t('cancel')}
                                            </button>
                                        </div>
                                    </>
                                )
                                : (
                                    <p>{t('loading')}</p>
                                )}
                        </div>
                    )}
                </div>

                <div className="secondary-actions">
                    <button onClick={handleSendEmail} type="button">{t('adminUserDetails.resendConfirmation')}</button>
                    <button onClick={handleConfirm} type="button">{t('adminUserDetails.confirmUser')}</button>
                    <button onClick={handleWorkoutsClick} type="button">{t('adminUserDetails.userWorkouts')}</button>
                    <button onClick={handlePermissionsClick} type="button">{t('adminUserDetails.permissions')}</button>
                </div>
            </div>
        </AdminPanel>
    );
};

export default inject('adminUsersStore', 'adminUsersController')(observer(UserData));
