/* eslint-disable react/jsx-no-bind */
/* eslint-disable sort-keys */
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import UserController from '../../../controllers/UserController';
import UserStore from '../../../store/userStore';
import './NewPermission.style.scss';

interface NewPermissionFormInterface {
    userController?: UserController;
    userStore?: UserStore;
}

const NewPermissionForm: React.FC<NewPermissionFormInterface> = ({
    userController, userStore
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        userController.getPermissionTypes();
    }, [userController]);

    const [userEmail, setUserEmail] = useState<string>('');
    const [resourceType, setResourceType] = useState<string>('');
    const [canAssign, setCanAssign] = useState<boolean>(false);
    const [canAccess, setCanAccess] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const handleSubmit = useCallback(() => {
        if (!userEmail || !resourceType) {
            setError(t('formValidationError'));
            return;
        }

        const newPermission = {
            to_user: userEmail,
            instance: resourceType,
            can_assign: canAssign,
            can_access: canAccess,
        };

        userController?.createPermission(newPermission);
    }, [userEmail,
        resourceType,
        canAssign,
        canAccess,
        userController,
        navigate,
        t]);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value);
        setError(t(null));
    }, []);

    const handleResourceTypeChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedValue = e.target.value;

            setResourceType(selectedValue);
            setError(t(null));
        },
        [resourceType]
    );

    return (
        <div className="new-permission-form">
            <h1>{t('createNewPermission')}</h1>

            {error && <p className="error">{error}</p>}

            <div className="form-group">
                <label>{t('user')}</label>
                <input
                    type="email"
                    value={userEmail}
                    onChange={handleEmailChange}
                    placeholder={t('enterEmail')}
                    required
                />
            </div>

            <div className="form-group">
                <label>{t('resourceType')}</label>
                <select value={resourceType} onChange={handleResourceTypeChange} required>
                    {userStore?.permissionsTypes.map(permission => (
                        <option key={permission} value={permission}>
                            {t(permission)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>{t('canAssign')}</label>
                <input
                    type="checkbox"
                    checked={canAssign}
                    onChange={() => setCanAssign(!canAssign)}
                />
            </div>

            <div className="form-group">
                <label>{t('canAccess')}</label>
                <input
                    type="checkbox"
                    checked={canAccess}
                    onChange={() => setCanAccess(!canAccess)}
                />
            </div>

            <div className="form-group">
                <button type="button" onClick={handleSubmit}>
                    {t('submit')}
                </button>
            </div>
        </div>
    );
};

export default inject('userStore', 'userController')(observer(NewPermissionForm));
