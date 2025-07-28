/* eslint-disable sort-keys */
import { action } from 'mobx';

import ClientsStore, { ClientInterface } from '../store/clientsStore';
import { BaseController } from '../../../controllers/BaseController';
import getApiBaseUrl from '../../../utils/apiUrl';
import Delete from '../../../utils/DeleteRequest';
import Get from '../../../utils/GetRequest';
import Post from '../../../utils/PostRequest';
import { toast } from 'react-toastify';

export default class ClientsController extends BaseController {
  clientsStore: ClientsStore;

  constructor(clientsStore: ClientsStore) {
      super();
      this.clientsStore = clientsStore;
  }

  @action
  fetchClients(): void {
      new Get({
          url: `${getApiBaseUrl()}/coach/clients`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.clientsStore.setClients(res.clients);
              }
          })
          .catch((): void => {
              toast.error('Не удалось получить клиентов');
          });
  }

  @action
  fetchClientById(clientId: number): Promise<ClientInterface | null> {
      return new Get({
          url: `${getApiBaseUrl()}/coach/clients/${clientId}`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok && res.client) {
                  return res.client as ClientInterface;
              }
              toast.error(res.error || 'Не удалось найти клиента');
              return null;
          })
          .catch(error => {
              toast.error(error || 'Не удалось добавить клиента');
              return null;
          });
  }

  @action
  addClient(email: string, code: string): void {
      new Post({
          params: { email, code },
          url: `${getApiBaseUrl()}/coach/clients`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.clientsStore.addClient(res.client);
              } else {
                  toast.error(res.error || 'Не удалось добавить клиента');
              }
          })
          .catch((): void => {
              toast.error( 'Не удалось добавить клиента');
          });
  }

  @action
  removeClient(clientId: number): void {
      new Delete({
          url: `${getApiBaseUrl()}/coach/clients/${clientId}`
      }).execute()
          .then(r => r.json())
          .then(res => {
              if (res.ok) {
                  this.clientsStore.removeClient(clientId);
              } else {
                  toast.error('Не удалось удалить клиента');
              }
          })
          .catch(() => {
              toast.error('Не удалось удалить клиента');
          });
  }
}
