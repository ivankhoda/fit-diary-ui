import { action } from 'mobx';
import AdminUsersStore from '../store/AdminUsersStore';
import { BaseController } from '../../../controllers/BaseController';

import Get from '../../../utils/GetRequest';



export default class AdminUsersController extends BaseController {
    adminUsersStore: AdminUsersStore;

    constructor(adminUsersStore: AdminUsersStore) {
        super();
        this.adminUsersStore = adminUsersStore;
    }

    @action
    getUsers(): void {
        new Get({ url: 'http://localhost:3000/admin/users' }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminUsersStore.setUserProfiles(res);
            });
    }

    @action
    getUserById(id:number): void {
        new Get({ url: `http://localhost:3000/admin/users/${id}` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminUsersStore.setUserProfile(res);
            });
    }

    @action
    sendEmail(id:number): void {
        new Get({ url: `http://localhost:3000/admin/users/${id}/resend_confirmation_instruction` }).execute();
    }

    @action
    confirm(id:number): void {
        new Get({ url: `http://localhost:3000/admin/users/${id}/confirm` }).execute();
    }


    @action
    getWorkoutsByUser(id: string): void {
        new Get({ url: `http://localhost:3000/admin/users/${id}/workouts` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminUsersStore.setWorkouts(res);
            });
    }

    @action
    getPermissonsByUser(id: string): void {
        new Get({ url: `http://localhost:3000/admin/users/${id}/permissions` }).execute()
            .then(r => r.json())
            .then(res => {
                this.adminUsersStore.setPermissons(res);
            });
    }
}
