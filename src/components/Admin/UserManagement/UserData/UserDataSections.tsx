import React from 'react';

export type EditableFieldName =
    'email'
    | 'first_name'
    | 'last_name'
    | 'phone_number'
    | 'telegram_username'
    | 'username';

export interface UserFormData {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    roles: string[];
    telegram_username: string;
    username: string;
}

export interface ReadonlyField {
    isComplex: boolean;
    key: string;
    value: string;
}

interface EditableFieldsProps {
    formData: UserFormData;
    isSaving: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    translate: (key: string) => string;
}

interface RoleSelectorProps {
    isSaving: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    roleOptions: string[];
    selectedRoles: string[];
    translate: (key: string) => string;
}

interface ReadonlyFieldsProps {
    fields: ReadonlyField[];
    translate: (key: string) => string;
}

export const DEFAULT_ROLE_OPTIONS = [
    'sportsman',
    'coach',
    'admin',
];
export const EDITABLE_FIELDS: EditableFieldName[] = [
    'username',
    'email',
    'first_name',
    'last_name',
    'telegram_username',
    'phone_number',
];
export const EXCLUDED_READONLY_FIELDS = new Set<string>([
    'role',
    'roles',
    ...EDITABLE_FIELDS,
]);

const FIELD_LABEL_KEYS: Record<EditableFieldName, string> = {
    email: 'adminUserDetails.fieldLabels.email',
    first_name: 'adminUserDetails.fieldLabels.firstName',
    last_name: 'adminUserDetails.fieldLabels.lastName',
    phone_number: 'adminUserDetails.fieldLabels.phoneNumber',
    telegram_username: 'adminUserDetails.fieldLabels.telegramUsername',
    username: 'adminUserDetails.fieldLabels.username',
};

export const READONLY_LABEL_KEYS: Record<string, string> = {
    active_plan: 'adminUserDetails.fieldLabels.activePlan',
    confirmed_at: 'adminUserDetails.fieldLabels.confirmedAt',
    created_at: 'adminUserDetails.fieldLabels.createdAt',
    has_active_workout: 'adminUserDetails.fieldLabels.hasActiveWorkout',
    has_coach_assigned_workouts: 'adminUserDetails.fieldLabels.hasCoachAssignedWorkouts',
    has_exercises: 'adminUserDetails.fieldLabels.hasExercises',
    has_workouts: 'adminUserDetails.fieldLabels.hasWorkouts',
    id: 'adminUserDetails.fieldLabels.id',
    updated_at: 'adminUserDetails.fieldLabels.updatedAt',
};

export const formatFallbackLabel = (value: string): string => value
    .split('_')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const getTranslatedLabel = (
    translate: (key: string) => string,
    translationKey: string,
    fallbackLabel: string,
): string => {
    const translated = translate(translationKey);

    return translated === translationKey ? fallbackLabel : translated;
};

export const EditableFields: React.FC<EditableFieldsProps> = ({ formData, isSaving, onChange, translate }) => (
    <div className="user-fields-grid">
        {EDITABLE_FIELDS.map(fieldName => (
            <label key={fieldName} className="user-field">
                <span>{getTranslatedLabel(translate, FIELD_LABEL_KEYS[fieldName], formatFallbackLabel(fieldName))}</span>
                <input
                    disabled={isSaving}
                    name={fieldName}
                    onChange={onChange}
                    type={fieldName === 'email' ? 'email' : 'text'}
                    value={formData[fieldName]}
                />
            </label>
        ))}
    </div>
);

export const RoleSelector: React.FC<RoleSelectorProps> = ({
    isSaving,
    onChange,
    roleOptions,
    selectedRoles,
    translate,
}) => (
    <div className="roles-section">
        <strong>{translate('adminUserDetails.roles')}</strong>
        <div className="roles-grid">
            {roleOptions.map(roleName => (
                <label key={roleName} className="role-option">
                    <input
                        checked={selectedRoles.includes(roleName)}
                        disabled={isSaving}
                        name={roleName}
                        onChange={onChange}
                        type="checkbox"
                    />
                    <span>
                        {getTranslatedLabel(
                            translate,
                            `adminUserDetails.roleLabels.${roleName}`,
                            formatFallbackLabel(roleName),
                        )}
                    </span>
                </label>
            ))}
        </div>
    </div>
);

export const ReadonlyFields: React.FC<ReadonlyFieldsProps> = ({ fields, translate }) => {
    if (fields.length === 0) {
        return null;
    }

    return (
        <div className="readonly-section">
            <strong>{translate('adminUserDetails.additionalFields')}</strong>
            <div className="readonly-fields-grid">
                {fields.map(field => {
                    const translationKey = READONLY_LABEL_KEYS[field.key] ?? `adminUserDetails.fieldLabels.${field.key}`;

                    return (
                        <div key={field.key} className="readonly-field">
                            <span>{getTranslatedLabel(translate, translationKey, formatFallbackLabel(field.key))}</span>
                            {field.isComplex ? <pre>{field.value}</pre> : <p>{field.value || '-'}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
