import React from 'react';

const AccountDeletion: React.FC = () => (
    <div className="legal-page">
        <h1>Удаление аккаунта</h1>
        <p>Дата обновления: 31 июля 2025</p>

        <p>
            Вы можете удалить свой аккаунт в любое время. Удаление аккаунта приведёт к безвозвратному удалению всех связанных с ним данных.
        </p>

        <h2>Как удалить аккаунт</h2>
        <ul>
            <li>
                <strong>Через email:</strong> напишите нам на
                <a href="mailto:ivankhoda@gmail.com">ivankhoda@gmail.com</a> с адреса, привязанного к вашему аккаунту,
                и мы удалим его в течение 7 рабочих дней.
            </li>
        </ul>

        <h2>Что происходит после удаления</h2>
        <ul>
            <li>Все ваши личные данные будут безвозвратно удалены.</li>
            <li>Вы не сможете восстановить удалённый аккаунт.</li>
        </ul>

        <h2>Поддержка</h2>
        <p>Если у вас возникли трудности или вопросы, свяжитесь с нами по адресу <a href="mailto:ivankhoda@gmail.com">ivankhoda@gmail.com</a>.</p>
    </div>
);

export default AccountDeletion;
